import { auth, db } from "@/services/firebaseConfig";
import Checkbox from "expo-checkbox";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
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
  
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useLocalSearchParams } from "expo-router";
import CustomInput from "@/components/CustomInput";


export default function Register() {
  

  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const { state } = useLocalSearchParams();

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
        state: state,
        phoneNumber: data.phoneNumber,
      });

      if (state === "needService") {
        router.replace("/(user)/");
      } else if (state === "provideService") {
        router.replace("/(provider)/");
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
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const passwordVar = watch("password");
  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ backgroundColor: "#F5F5F5" }}>
        <View style={[styles.firstSection, styles.mB23]}>
          <Text style={[styles.startText, styles.mB16, styles.mT_50]}>
            Getting Started
          </Text>
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

            <Controller
              control={control}
              name="address"
              rules={{ required: "Address is required" }}
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
                <CustomInput
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={error}
                  isTouched={isTouched}
                />
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
                <CustomInput
                  placeholder="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={error}
                  isTouched={isTouched}
                />
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
              disabled={!isValid || !checked}
              style={[
                styles.ContinuePress,
                {
                  backgroundColor: isValid && checked ? "#FD6B22" : "#ccc",
                  borderColor: isValid && checked ? "#FD6B22" : "#ccc",
                },
              ]}
            >
              <Text style={[styles.ContinueText]}>Register</Text>
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
  mT_50: {
    marginTop: 50,
  },
  padLeft_9: {
    paddingLeft: RFValue(9),
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
 
});
