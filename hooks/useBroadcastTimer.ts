import { router } from "expo-router";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig";

export const useBroadcastTimer = (
  requestId: string | string[] | undefined,
  duration: number = 20,
) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    if (!requestId || Array.isArray(requestId)) return;

    const unsub = onSnapshot(doc(db, "requests", requestId), (snapshot) => {
      const data = snapshot.data();
      if (data?.status === "accepted") {
        setIsAccepted(true);
        router.push({
          pathname: "/request-progress",
          params: { requestId },
        });
      }
    });

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout(requestId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, [requestId]);

  const handleTimeout = async (id: string) => {
    try {
      await updateDoc(doc(db, "requests", id), {
        status: "timeout",
      });
    } catch (e) {
      console.error("Timeout update failed", e);
    }
    router.push("/user/requestPending");
  };

  return { timeLeft, isAccepted };
};
