import { auth } from "@/services/firebaseConfig";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

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
