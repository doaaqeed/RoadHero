import CustomInput from "@/components/CustomInput";
import { auth, db } from "@/services/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { signOut, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
const IMGBB_API_KEY = "f8c1bfe3710715a1fe2209d1fa0471b2";

export default function Profile() {
  const router = useRouter();
  const { state } = useLocalSearchParams();
  const [imgUrl, setImgurl] = useState(null);

  const uploadToImgBB = async (fileUri) => {
    const formData = new FormData();
    formData.append("image", {
      uri: fileUri,
      type: "image/jpeg",
      name: "profilePhoto.jpg",
    });

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const data = await response.json();

      if (data.success) {
        const remoteUrl = data.data.url;
        saveToFirebase(remoteUrl);
      } else {
        Alert.alert("Error, upload to ImgBB failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error");
    }
  };

  const saveToFirebase = async (url) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          profileImage: url,
        });

        setImgurl(url);
        Alert.alert("The image has been updated successfully :)");
      }
    } catch (error) {
      console.log("fiald to save the url in firebase");
    }
  };

  const takePhoto = async () => {
    const permissionResult = ImagePicker.requestCameraPermissionsAsync();
    if ((await permissionResult).granted === false) {
      Alert.alert("Sorry, the app needs to be allowed to access the camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setImgurl(localUri);

      uploadToImgBB(localUri);
    }
  };
  /* 
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImgurl(result.assets[0].uri);
      uploadToImgBB(result.assets[0].uri);
    }
  };*/

  const { control, handleSubmit, reset } = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      phoneNumber: "",
      password: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.profileImage) {
            setImgurl(data.profileImage);
          }
          reset({
            fullName: data.fullName,
            email: data.email,
            address: data.address,
            phoneNumber: data.phoneNumber,
            password: "",
          });
        }
      }
    };

    fetchUserData();
  }, [reset]);

  const onSubmit = async (data) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          fullName: data.fullName,
          address: data.address,
          phoneNumber: data.phoneNumber,
        });

        if (data.password && data.password.trim() !== "") {
          await updatePassword(user, data.password);
        }
        Alert.alert("Success", "Profile updated successfully!");
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Could not update profile");
      }
    }
    return;
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);

            router.replace("/login");
          } catch (error) {
            Alert.alert("Error", "Failed to log out. Please try again.");
          }
        },
      },
    ]);
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={{ backgroundColor: "#ffffff" }}>
        <View style={[styles.center, styles.firstSection]}>
          <Pressable onPress={takePhoto}>
            <Image
              source={{
                uri:
                  imgUrl ||
                  "https://cdn-icons-png.flaticon.com/128/11311/11311954.png",
              }}
              style={styles.image}
            />
          </Pressable>
          <Text style={[styles.edite, styles.edit_m]}>Edit</Text>
        </View>

        <View style={[styles.secondSection]}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={[styles.center]}>
              {/* Full Name */}
              <Controller
                control={control}
                name="fullName"
                rules={{
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                }}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { error, isTouched },
                }) => (
                  <CustomInput
                    placeholder="Full Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error}
                    isTouched={isTouched}
                  />
                )}
              />

              {/* Email */}
              <Controller
                control={control}
                name="email"
                rules={{
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                }}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { error, isTouched },
                }) => (
                  <CustomInput
                    placeholder="Email Adress"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error}
                    isTouched={isTouched}
                  />
                )}
              />

              {/* Address */}
              <Controller
                control={control}
                name="address"
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { error, isTouched },
                }) => (
                  <CustomInput
                    placeholder="Current Address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error}
                    isTouched={isTouched}
                  />
                )}
              />

              {/* Phone Number */}
              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "10 correct numbers must be entered.",
                  },
                }}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { error, isTouched },
                }) => (
                  <CustomInput
                    placeholder="phone number"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error}
                    isTouched={isTouched}
                  />
                )}
              />

              {/* Password */}
              <Controller
                control={control}
                name="password"
                rules={{
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { error, isTouched },
                }) => (
                  <CustomInput
                    placeholder="Leave blank to keep current password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error}
                    isTouched={isTouched}
                    secureTextEntry={true}
                  />
                )}
              />
            </View>
          </KeyboardAvoidingView>

          <View style={[styles.center, styles.mT_30, styles.row]}>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={styles.ContinuePress}
            >
              <Text style={styles.ContinueText}>Save</Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              style={styles.ContinuePress}
            >
              <Text style={styles.ContinueText}>Cancle</Text>
            </Pressable>
          </View>

          <View style={[styles.center]}>
            <Pressable onPress={handleLogout} style={styles.logOut}>
              <Text style={styles.ContinueText}>Log out</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  firstSection: {
    backgroundColor: "#f07e41",
    height: 330,
  },
  secondSection: {
    paddingTop: 50,
    marginTop: -70,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#ffffff",
  },
  logOut: {
    borderWidth: 2,
    borderColor: "#ece4e4",
    padding: RFValue(16),
    borderRadius: RFValue(25),
    backgroundColor: "#fc2929ea",
    marginBottom: 30,
    width: RFValue(300),
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    gap: 40,
  },
  mT_30: {
    marginTop: 30,
  },
  edite: {
    fontSize: 18,
    color: "#fcf3f0f5",
  },

  ContinuePress: {
    borderWidth: 1,
    borderColor: "#ece4e4",
    padding: RFValue(16),
    borderRadius: RFValue(25),
    backgroundColor: "#f07e41",
    marginBottom: 30,
    width: RFValue(120),
    alignItems: "center",
    justifyContent: "center",
  },
  ContinueText: {
    fontSize: RFValue(15),
    color: "#ffffff",
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  edit_m: {
    marginBottom: 50,
    marginTop: 10,
  },
});
