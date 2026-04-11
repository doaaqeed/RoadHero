import {
  ScrollView,
  TextInput,
  View,
  Text,
  Pressable,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebaseConfig";
import { useRouter } from "expo-router";


export default function Register(){
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
         console.log("AUTH OK");

         const user = userCredential.user;
         console.log("USER:", userCredential.user);

         await setDoc(doc(db, "users", user.uid), {
           fullName: data.fullName,
           email: data.email,
           address: data.address,
           state: data.state,
         });
         console.log("FIRESTORE OK");

         //router.replace("/home");
       } catch (error) {
         console.log(error.message);
       }

       console.log(data);
     };

       const {
         control,
         handleSubmit,
         watch,
         formState: { errors },
       } = useForm();

       const passwordVar = watch("password"); 

    

    return (
      <ScrollView>
        <Text> Register</Text>
        <View>
          <Text>Getting Started</Text>
          <Text>Seems you are new here, Let’s set up your account.</Text>
        </View>

        <View>
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
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Full Name"
                value={value}
                onChangeText={onChange}
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
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Email Address"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            rules={{ required: "Address is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Current Address"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="state"
            rules={{
              required: "State is required",
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="State"
                value={value}
                onChangeText={onChange}
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
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: "Confirm your password",
              validate: (value) =>
                value === passwordVar || "Passwords do not match",
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
        <View>
          <View>
            <Checkbox value={checked} onValueChange={setChecked} />
            <Text>
              By creating an account, you agree to our Term and Conditions
            </Text>
          </View>
          <View>
            <Pressable onPress={handleSubmit(onSubmit)}>
              <Text>Continue</Text>
            </Pressable>
          </View>
          <View>
            <Text>
              Already have an account ?<Link href="/login">Login</Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    );

}