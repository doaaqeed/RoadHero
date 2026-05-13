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

/*
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
});*/

import { auth } from "@/services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react"; 
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";

export default function Index() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    
    let unsubscribe;

    const checkNavigation = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");

       
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          
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
                  router.replace("/user/serviceRequestScreen");
                } else if (State === "provideService") {
                  router.replace("/(tabs)");
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
      if (unsubscribe) unsubscribe();
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
    backgroundColor: "#fff",}
  })
