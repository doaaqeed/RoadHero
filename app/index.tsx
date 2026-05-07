import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebaseConfig";

export default function Index() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (user === undefined) return null;
  

  return user ? (
    <Redirect href="/user/serviceRequestScreen" />
  ) : (
    <Redirect href="/login" />
  );
}
