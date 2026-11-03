// Public Firebase Web App configuration.
// These values identify your Firebase project; they are not database passwords.
// Copy the exact values from Firebase Console > Project settings > Your apps.
export const firebaseConfig = {
  apiKey: "PASTE_YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "PASTE_YOUR_REALTIME_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  appId: "PASTE_YOUR_FIREBASE_APP_ID"
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(value =>
  typeof value === "string" &&
  value.trim() &&
  !value.includes("PASTE_") &&
  !value.includes("YOUR_PROJECT_ID")
);
