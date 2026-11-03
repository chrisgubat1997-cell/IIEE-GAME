import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

function status(message) {
  if (typeof window.setCloudStatus === "function") {
    window.setCloudStatus(message);
  }
}

if (!isFirebaseConfigured) {
  status("CLOUD SETUP NEEDED");
} else {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);
    let listening = false;

    onAuthStateChanged(auth, async user => {
      if (!user) {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Kiosk anonymous sign-in failed:", error);
          status("CLOUD SIGN-IN ERROR");
        }
        return;
      }

      if (listening) return;
      listening = true;
      status("CONNECTING TO CLOUD");

      const questionsRef = ref(db, "iieeGame/questions");
      onValue(questionsRef, snapshot => {
        const bank = snapshot.val();
        if (bank && typeof window.applyCloudQuestionBank === "function" &&
            window.applyCloudQuestionBank(bank)) {
          status("CLOUD CONNECTED • LIVE");
        } else {
          // No cloud question bank has been published yet.
          // Keep the built-in or last cached question set until the organizer publishes one.
          status("CLOUD READY • DEFAULT QUESTIONS");
        }
      }, error => {
        console.error("Question bank listener failed:", error);
        status("CLOUD READ ERROR");
      });
    });
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    status("CLOUD CONFIG ERROR");
  }
}
