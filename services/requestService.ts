import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const sendServiceRequest = async (
  serviceType: string,
  specificDetails: object,
  location: any,
  address: string,
) => {
  const auth = getAuth();
  const user = auth.currentUser; // هذا يجلب المستخدم المسجل حالياً

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً");
  }

  try {
    // نستخدم user.uid وهو المعرف الفريد الذي يوفره فايربيز تلقائياً
    const docRef = await addDoc(collection(db, "requests"), {
      userUID: user.uid, // هذا هو الرابط بين الطلب وبين المستخدم (ردا)
      userEmail: user.email, // إضافي: لتسهيل البحث بالإيميل إذا أردت
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
