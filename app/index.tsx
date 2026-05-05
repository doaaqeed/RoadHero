import { Redirect } from "expo-router";
import { auth } from "@/services/firebaseConfig";

export default function Index() {
  if (auth.currentUser) {
    return <Redirect href="/user/serviceRequestScreen" />;
  }

  return <Redirect href="/login" />;
}
