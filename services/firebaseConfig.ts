import { initializeApp, getApps, getApp } from "firebase/app";
import * as SecureStore from "expo-secure-store"; 
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD22r3jTVD0lVEro20kvLcYj9xUYKdNSfc",
  authDomain: "roadhero-1557f.firebaseapp.com",
  projectId: "roadhero-1557f",
  storageBucket: "roadhero-1557f.firebasestorage.app",
  messagingSenderId: "1072948259215",
  appId: "1:1072948259215:web:0543cb89e8eb70478903fa",
  measurementId: "G-46GTH33TNG",
};

const secureStorePersistence = {
  async getItem(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("SecureStore getItem error:", error);
      return null;
    }
  },
  async setItem(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("SecureStore setItem error:", error);
    }
  },
  async removeItem(key: string) {
    try {
      return await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error("SecureStore removeItem error:", error);
    }
  }
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = getAuth(app);
} catch (error) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(secureStorePersistence),
  });
}

export const db = getFirestore(app);

export { app, auth };