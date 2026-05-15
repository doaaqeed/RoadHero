import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export const createProviderProfile = async (
  userId: string,
  providerData: any,
  selectedSkills: string[],
) => {
  try {
    await setDoc(doc(db, "providers", userId), {
      ...providerData,
      skills: selectedSkills,
      available: false,
      rating: 5,
      completedRequests: 0,
      createdAt: serverTimestamp(),
      location: null,
    });
    console.log("Provider profile successfully created!");
  } catch (error) {
    console.error("Error creating provider profile: ", error);
    throw error;
  }
};
