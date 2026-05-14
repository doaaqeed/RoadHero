import * as Network from "expo-network";
import { addDoc, collection } from "firebase/firestore";
import { useEffect } from "react";
import { db as firestore } from "../services/firebaseConfig";
import {
  deleteOfflineRequest,
  getOfflineRequests,
} from "../utils/offlineStorage";

export const useSync = () => {
  useEffect(() => {
    const syncData = async () => {
      const state = await Network.getNetworkStateAsync();

      // Only attempt sync if we are online
      if (state.isConnected && state.isInternetReachable) {
        const offlineItems = await getOfflineRequests();

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
                status: "pending", // Update status from 'offline' to 'pending'
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
