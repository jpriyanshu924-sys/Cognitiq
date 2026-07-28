// firebase-config.js
// Replace the values below with your web app's Firebase configuration from the Firebase Console.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;
let isFirebaseReady = false;

if (typeof firebase !== 'undefined' && firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    isFirebaseReady = true;
    console.log("🔥 Firebase Firestore initialized successfully!");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else {
  console.warn("⚠️ Firebase configuration is missing or using placeholders. All test results will be saved in localStorage only.");
}
