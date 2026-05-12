import { useRouter } from "expo-router";
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
}
