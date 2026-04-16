import { auth, db } from "@/services/firebaseConfig";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import Checkbox from "expo-checkbox";
import { Link, Stack, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function Register() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    if (!checked) {
      alert("Please agree to the Terms and Conditions");
      return;
    }
    try {
      console.log("START");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: data.fullName,
        email: data.email,
        address: data.address,
        state: data.state,
      });

      const userState = data.state?.toLowerCase().trim();
      if (userState === "user") {
        router.replace("/user/serviceRequestScreen");
      } else if (userState === "provider") {
        router.replace("/(tabs)");
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered.");
        router.replace("/login");
      } else {
        alert(error.message);
      }
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const passwordVar = watch("password");
  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ backgroundColor: "#F5F5F5" }}>
        <View style={styles.center}>
          <Text style={[styles.title]}> Register</Text>
        </View>

        <View style={[styles.firstSection, styles.mB23]}>
          <Text style={[styles.startText, styles.mB16]}>Getting Started</Text>
          <Text style={styles.paragraph}>Seems you are new here,</Text>
          <Text style={styles.paragraph}>Let’s set up your account.</Text>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={[styles.center]}>
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

            <Controller
              control={control}
              name="state"
              rules={{
                required: "State is required",
              }}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error, isTouched },
              }) => (
                <View style={{ marginBottom: 30 }}>
                  <TextInput
                    placeholder="State"
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

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Confirm Password is required",
                validate: (value) =>
                  value === passwordVar || "Passwords do not match",
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

        <View>
          <View style={[styles.terms, styles.firstSection]}>
            <Checkbox
              value={checked}
              onValueChange={setChecked}
              style={styles.CheckboxStyle}
            />
            <View>
              <Text style={styles.padLeft_9}>
                By creating an account, you agree to our
              </Text>
              <Text style={[styles.padLeft_9, styles.main_color]}>
                Term and Conditions
              </Text>
            </View>
          </View>
          <View style={[styles.center, styles.mT_30]}>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={styles.ContinuePress}
            >
              <Text style={[styles.ContinueText]}>Continue</Text>
            </Pressable>
          </View>
          <View style={[styles.center, styles.mB28, styles.mT_1]}>
            <Text>
              Already have an account ?
              <Link href="/login" style={styles.loginLink}>
                Login
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "600",
    fontSize: RFValue(18),
    paddingTop: 60,
    fontFamily: "Inter_600SemiBold",
  },
  startText: {
    fontWeight: "600",
    fontSize: RFValue(32),
    paddingTop: 20,
    fontFamily: "Inter_600SemiBold",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  paragraph: {
    fontWeight: "400",
    fontSize: RFValue(16),
    color: "#827f7f",
  },
  firstSection: {
    gap: 7,
    paddingLeft: RFValue(31),
  },
  mB16: {
    marginBottom: 16,
  },
  mB23: {
    marginBottom: 23,
  },
  mB28: {
    marginBottom: 28,
  },
  mB_14: {
    marginBottom: 14,
  },
  mT_1: {
    marginTop: 1,
  },
  mT_30: {
    marginTop: 30,
  },
  padLeft_9: {
    paddingLeft: RFValue(9),
  },
  input: {
    borderWidth: 1,
    padding: RFValue(20),
    borderRadius: RFValue(18),
    fontSize: RFValue(12),
    width: RFValue(300),
    writingDirection: "ltr",
  },
  terms: {
    flexDirection: "row",
  },
  CheckboxStyle: {
    borderRadius: 6,
  },
  main_color: {
    color: "#FD6B22",
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
  loginLink: {
    color: "#FD6B22",
  },
  ERROR_MESSAGES: {
    color: "rgba(242, 5, 5, 0.79)",
    paddingTop: 5,
    paddingLeft: 20,
    fontSize: RFValue(11),
  },
});
