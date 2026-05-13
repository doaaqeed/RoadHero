import { auth } from "@/services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import { Link, Stack, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import CustomInput from "@/components/CustomInput";


export default function Login() {
 
  const router = useRouter();

  

  const onSubmit = async (data) => {
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = userCredential.user;
      console.log("start");
      await new Promise((resolve) => setTimeout(resolve, 500));

      const userDoc = await getDoc(doc(db, "users", user.uid));
      console.log("start2");

     

      const userData = userDoc.data();
      console.log("Full User Data:", userData);
      const state= userData?.state;
      console.log("start4");
      
      
        if (state === "needService") {
          router.replace("/user/serviceRequestScreen");
        } else if (state === "provideService") {
          router.replace("/(tabs)");
        }

      

      
    } catch (error) {
      alert("Invalid email or password");
      }
    
  };

  const {
    control,
    handleSubmit,
    
    formState: { errors },
  } = useForm({ mode: "onBlur" });

 

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView>
        <View style={[styles.firstSection, styles.mB23]}>
          <Text style={[styles.startText, styles.mB16, styles.mT_150]}>
            Let’s Log You In
          </Text>
          <Text style={styles.paragraph}>Welcome back, you’ve</Text>
          <Text style={styles.paragraph}>been missed!</Text>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={[styles.center]}>
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
                  placeholder="Email Address"
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
          </View>
        </KeyboardAvoidingView>

        <View style={[styles.center, styles.mT_30]}>
          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={styles.ContinuePress}
          >
            <Text style={[styles.ContinueText]}>Login</Text>
          </Pressable>

          <View style={[styles.center, styles.mB28, styles.mT_1]}>
            <Text>
              Don't have an account ?
              <Link href="/selectRole" style={styles.loginLink}>
                Register
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );}


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
  mT_150: {
    marginTop: 150,
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
