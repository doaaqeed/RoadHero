import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const sendServiceRequest = async (
  serviceType: string,
  specificDetails: object,
  location: { latitude: number; longitude: number },
  address: string,
) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("should login first");
  }

  try {
    const docRef = await addDoc(collection(db, "requests"), {
      userUID: user.uid,
      userEmail: user.email,
      serviceType: serviceType,
      status: "pending",
      address: address,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      details: specificDetails,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (e) {
    console.error("Error: ", e);
    throw e;
  }
};
