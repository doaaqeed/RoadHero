/*
import { initializeApp, getApps, getApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
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

let auth;
if (!getApps().length) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  try {
    auth = getAuth(app);
  } catch (e) {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
}

export const db = getFirestore(app);
export { auth };
*/
/*
import { initializeApp, getApps, getApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
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

// 1. تشغيل التطبيق
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 2. تعريف الـ Auth بطريقة تمنع التكرار وتجبر الـ Persistence
let auth;
if (getApps().length > 0) {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export const db = getFirestore(app);
export { auth };*/

import { initializeApp, getApps, getApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
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

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);