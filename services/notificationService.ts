import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Platform } from "react-native";
import { auth, db } from "./firebaseConfig";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert("Push notifications need a real device.");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Notification permission not granted.");
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    alert("Missing Expo projectId. Run: eas init");
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return token.data;
}

export async function savePushTokenToCurrentUser(role: "user" | "provider") {
  const user = auth.currentUser;

  if (!user) return;

  const token = await registerForPushNotificationsAsync();

  if (!token) return;

  const collectionName = role === "provider" ? "providers" : "users";

  await updateDoc(doc(db, collectionName, user.uid), {
    expoPushToken: token,
  });
}

export async function getUserExpoPushToken(userUID: string) {
  const userRef = doc(db, "users", userUID);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return null;

  return userSnap.data().expoPushToken || null;
}

export async function sendExpoPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data: object = {}
) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data,
    }),
  });
}