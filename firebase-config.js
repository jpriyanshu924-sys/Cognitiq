// firebase-config.js
// Firebase configuration for CampusPlay (campusplay-6548f)
const firebaseConfig = {
  apiKey: "AIzaSyCXtdiZjOaw1vdmEsw3BzRhHRuKt0KXGeo",
  authDomain: "campusplay-6548f.firebaseapp.com",
  projectId: "campusplay-6548f",
  storageBucket: "campusplay-6548f.firebasestorage.app",
  messagingSenderId: "518395060864",
  appId: "1:518395060864:web:a5e36c1c369492db3cbc65",
  measurementId: "G-FG1P19TR72"
};

let db = null;
let isFirebaseReady = false;

if (typeof firebase !== 'undefined' && firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    isFirebaseReady = true;
    console.log("🔥 Firebase Firestore initialized successfully for project: " + firebaseConfig.projectId);
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else {
  console.warn("⚠️ Firebase configuration is missing or using placeholders. All test results will be saved in localStorage only.");
}
