import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
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

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
export { app, auth, db };

