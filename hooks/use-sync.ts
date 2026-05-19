import * as Network from "expo-network";
import { addDoc, collection } from "firebase/firestore";
import { useEffect } from "react";
import { db as firestore } from "../services/firebaseConfig";
import {
  deleteOfflineRequest,
  getOfflineRequests,
} from "../utils/offline-storage";

interface OfflineRequest {
  id: number;
  userUID: string;
  userEmail: string;
  serviceType: string;
  address: string;
  latitude: number;
  longitude: number;
  details: string;
  createdAt: string | number;
}

export const useSync = (): void => {
  useEffect(() => {
    const syncData = async (): Promise<void> => {
      const state = await Network.getNetworkStateAsync();

      // Only attempt sync if online
      if (state.isConnected && state.isInternetReachable) {
        const offlineItems: OfflineRequest[] = await getOfflineRequests();

        if (offlineItems.length > 0) {
          console.log(`Found ${offlineItems.length} items to sync...`);

          for (const item of offlineItems) {
            try {
              // Push to Firebase
              await addDoc(collection(firestore, "requests"), {
                userUID: item.userUID,
                userEmail: item.userEmail,
                serviceType: item.serviceType,
                address: item.address,
                location: {
                  latitude: item.latitude,
                  longitude: item.longitude,
                },
                details: JSON.parse(item.details),
                status: "pending",
                createdAt: item.createdAt,
              });

              // Remove from SQLite after successful upload
              await deleteOfflineRequest(item.id);
            } catch (err) {
              console.error("Failed to sync item:", err);
            }
          }
        }
      }
    };

    const interval = setInterval(syncData, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);
};
