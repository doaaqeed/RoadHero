import { Link, Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, 
  Image,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from "expo-image-picker";



export default function Profile() {
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const { state } = useLocalSearchParams();
  const [imgUrl,setImgurl]=useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImgurl(result.assets[0].uri);
    }
  };

  // تعريف useForm
  const { control, handleSubmit, watch } = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    if (state === "needService") {
      router.replace("/user/serviceRequestScreen");
    } else if (state === "provideService") {
      router.replace("/(tabs)");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ backgroundColor: "#F5F5F5" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={[styles.center]}>
            <Pressable onPress={pickImage}>
              <Image
                source={{
                  uri:
                    imgUrl ||
                    "https://cdn-icons-png.flaticon.com/128/10307/10307852.png",
                }}
                style={styles.image}
              />
            </Pressable>
            <Text style={[styles.edite,styles.edit_m]}>Edite</Text>
          </View>
          <View style={[styles.center]}>
            {/* Full Name */}
            <Controller
              control={control}
              name="fullName"
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              }}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error, isTouched },
              }) => (
                <View style={{ marginBottom: 30 }}>
                  <TextInput
                    placeholder="Full Name"
                    value={value}
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        borderColor: error
                          ? "red"
                          : isTouched
                            ? "green"
                            : "#ccc",
                      },
                    ]}
                    onBlur={onBlur}
                    placeholderTextColor="#706e6e"
                  />
                  {error && (
                    <Text style={styles.ERROR_MESSAGES}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              }}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error, isTouched },
              }) => (
                <View style={{ marginBottom: 30 }}>
                  <TextInput
                    placeholder="Email Address"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[
                      styles.input,
                      {
                        borderColor: error
                          ? "red"
                          : isTouched
                            ? "green"
                            : "#ccc",
                      },
                    ]}
                    onBlur={onBlur}
                    placeholderTextColor="#706e6e"
                  />
                  {error && (
                    <Text style={styles.ERROR_MESSAGES}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Address */}
            <Controller
              control={control}
              name="address"
              rules={{ required: "Address is required" }}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error, isTouched },
              }) => (
                <View style={{ marginBottom: 30 }}>
                  <TextInput
                    placeholder="Current Address"
                    value={value}
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        borderColor: error
                          ? "red"
                          : isTouched
                            ? "green"
                            : "#ccc",
                      },
                    ]}
                    onBlur={onBlur}
                    placeholderTextColor="#706e6e"
                  />
                  {error && (
                    <Text style={styles.ERROR_MESSAGES}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Phone Number */}
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                required: "phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "10 correct numbers must be entered.",
                },
              }}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error, isTouched },
              }) => (
                <View style={{ marginBottom: 30 }}>
                  <TextInput
                    placeholder="phone number"
                    value={value}
                    onChangeText={(text) =>
                      onChange(text.trim().replace(/[^0-9]/g, ""))
                    }
                    style={[
                      styles.input,
                      {
                        borderColor: error
                          ? "red"
                          : isTouched
                            ? "green"
                            : "#ccc",
                      },
                    ]}
                    onBlur={onBlur}
                    placeholderTextColor="#706e6e"
                  />
                  {error && (
                    <Text style={styles.ERROR_MESSAGES}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error, isTouched },
              }) => (
                <View style={{ marginBottom: 30 }}>
                  <TextInput
                    placeholder="Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        borderColor: error
                          ? "red"
                          : isTouched
                            ? "green"
                            : "#ccc",
                      },
                    ]}
                    onBlur={onBlur}
                    placeholderTextColor="#706e6e"
                  />
                  {error && (
                    <Text style={styles.ERROR_MESSAGES}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Confirm Password is required",
                validate: (val) => {
                  if (watch("password") !== val) {
                    return "Passwords do not match";
                  }
                },
              }}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error, isTouched },
              }) => (
                <View style={{ marginBottom: 30 }}>
                  <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        borderColor: error
                          ? "red"
                          : isTouched
                            ? "green"
                            : "#ccc",
                      },
                    ]}
                    onBlur={onBlur}
                    placeholderTextColor="#706e6e"
                  />
                  {error && (
                    <Text style={styles.ERROR_MESSAGES}>{error.message}</Text>
                  )}
                </View>
              )}
            />
          </View>
        </KeyboardAvoidingView>

        <View style={[styles.center, styles.mT_30]}>
          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={styles.ContinuePress}
          >
            <Text style={styles.ContinueText}>Save</Text>
          </Pressable>
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
  mT_30: {
    marginTop: 30,
  },
  edite: {
    fontSize: 18,
    color: "#f66733f5",
  },

  input: {
    borderWidth: 1,
    padding: RFValue(20),
    borderRadius: RFValue(18),
    fontSize: RFValue(12),
    width: RFValue(300),
  },
  ContinuePress: {
    borderWidth: 1,
    borderColor: "#ece4e4",
    padding: RFValue(20),
    borderRadius: RFValue(25),
    backgroundColor: "#FD6B22",
    marginBottom: 30,
    width: RFValue(210),
    alignItems: "center",
    justifyContent: "center",
  },
  ContinueText: {
    fontSize: RFValue(15),
    color: "#f1ecec",
  },
  ERROR_MESSAGES: {
    color: "rgba(242, 5, 5, 0.79)",
    paddingTop: 5,
    paddingLeft: 20,
    fontSize: RFValue(11),
  },
  image: {
    width: 170,
    height: 170,
    borderRadius: 100,
    marginTop: 80,
  },
  edit_m: {
    marginBottom: 50,
    marginTop: 10,
  },
});
