/*import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "@/services/firebaseConfig";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";


export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
       
      
     
      if (user) {

       
       
        router.replace("/user/serviceRequestScreen");
      } else {
       
        router.replace("/login");
      }
      setIsReady(true);
    });


    return unsubscribe; 
  }, []);
  


 
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}*/
import { auth } from "@/services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkNavigation = async () => {
      try {
        // 1. Check if user has seen onboarding
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");

        // 2. Check Firebase Auth State
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (hasLaunched === null) {
            // First time ever opening the app
            router.replace("/onboarding");
          } else if (user) {
            // Returning user who is already signed in
            router.replace("/user/serviceRequestScreen");
          } else {
            // Returning user who needs to log in
            router.replace("/login");
          }
        });

        return unsubscribe;
      } catch (e) {
        console.error("Navigation Error:", e);
        router.replace("/login"); // Fallback
      }
    };

    checkNavigation();
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
    backgroundColor: "#fff",
  },
});
