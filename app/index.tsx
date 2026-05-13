import { auth, db } from "@/services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react"; 
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let unsubscribeAuth: () => void; 

    const checkNavigation = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");

        unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
          console.log("User UID:", user ? user.uid : "NULL (No Session)");

          if (hasLaunched === null) {
            router.replace("/onboarding");
          } else if (user) {
            try {
              const userDoc = await getDoc(doc(db, "users", user.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                const State = userData.state;

                if (State === "needService") {
                  router.replace("/(user)/index");
                } else if (State === "provideService") {
                  router.replace("/(provider)/index");
                } else {
                  router.replace("/(auth)/login");
                }
              } else {
                router.replace("/(auth)/login");
              }
            } catch (error) {
              console.error("Error fetching role:", error);
              router.replace("/(auth)/login");
            }
          } else {
            router.replace("/(auth)/login");
          }

          setInitializing(false);
        });
      } catch (e) {
        console.error("Navigation Error:", e);
        setInitializing(false);
      }
    };

    checkNavigation();

    
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF8C00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
});
