# IIEE GAME — Firebase live question setup

The public TV page is `index.html`. The private editing page is `organizer.html`.
Both use one Firebase Realtime Database question bank. After the one-time setup below, a saved edit on the organizer phone/laptop is pushed to the connected TV page in real time.

## 1. Create a Firebase project and register a Web App

1. Open https://console.firebase.google.com/ and sign in with a Google account you control.
2. Create a Firebase project (example project name: `IIEE Game`).
3. In Project Overview, choose **Add app** → **Web** (`</>`).
4. Give it a nickname such as `IIEE Game Web` and register it.
5. Copy the Firebase Web App configuration values. You will need `apiKey`, `authDomain`, `projectId`, and `appId`.

Official guide: https://firebase.google.com/docs/web/setup

## 2. Create the Realtime Database

1. In Firebase Console, open **Databases & Storage → Realtime Database**.
2. Click **Create database**.
3. Choose a location close to the Philippines, such as `asia-southeast1`, when offered.
4. Choose **Locked mode**. Do not leave the database in Test mode.
5. Copy the database URL shown by Firebase. Use that exact URL in the next step.

Official guide: https://firebase.google.com/docs/database/web/start

## 3. Enable the two Authentication providers

In **Authentication → Sign-in method** (or **Sign-in providers**):

- Enable **Email/Password**. This is used by the private organizer page.
- Enable **Anonymous**. This is used by the public game TV to read the question bank without needing an organizer login.

Then go to **Authentication → Users** and add the organizer user:

- Email: `chrisgubat1997@gmail.com` (or the email you want to authorize in the database rules).
- Set a strong password and keep it private. Do not put the password in GitHub or in `firebase-config.js`.

Official guides:
- Email/password: https://firebase.google.com/docs/auth/web/password-auth
- Anonymous sign-in: https://firebase.google.com/docs/auth/web/anonymous-auth

## 4. Add the GitHub Pages domain to Authorized domains

In **Authentication → Settings → Authorized domains**, add:

`chrisgubat1997-cell.github.io`

This allows Firebase Authentication to be used from your GitHub Pages site.

## 5. Fill in firebase-config.js

Open this file in the GitHub repository:

https://github.com/chrisgubat1997-cell/IIEE-GAME/blob/main/firebase-config.js

Replace the placeholder values with the exact values from your Firebase Web App and Realtime Database:

- `apiKey` → Firebase Web App apiKey
- `authDomain` → Firebase Web App authDomain
- `databaseURL` → the exact Realtime Database URL
- `projectId` → Firebase projectId
- `appId` → Firebase Web App appId

These are Firebase client configuration values, not a database password. Keep the database protected by the Security Rules in the next step.

## 6. Publish these Realtime Database Security Rules

In **Realtime Database → Rules**, replace the rules with the following. This lets authenticated clients (including the TV's anonymous session) read the question bank, but only the named organizer email can write changes.

```json
{
  "rules": {
    "iieeGame": {
      "questions": {
        ".read": "auth != null",
        ".write": "auth != null && auth.token.email === 'chrisgubat1997@gmail.com'"
      }
    }
  }
}
```

If you created the organizer user with a different email, replace `chrisgubat1997@gmail.com` in the rule with that exact email address.

**Do not use public read/write rules such as `.read: true` or `.write: true`.** The organizer email restriction is what prevents public game visitors from changing the questions.

Firebase rules reference: https://firebase.google.com/docs/database/security

## 7. Publish starter questions and connect the TV

1. Open the organizer page: https://chrisgubat1997-cell.github.io/IIEE-GAME/organizer.html
2. Sign in using the Firebase organizer email/password created in Step 3.
3. Click **PUBLISH STARTER 10** to put the initial 10 questions in the cloud.
4. Open the TV game: https://chrisgubat1997-cell.github.io/IIEE-GAME/
5. The top-right status should change to **CLOUD CONNECTED • LIVE**.

From then on, edit questions from the organizer phone/laptop and press **SAVE TO ALL KIOSKS**. The TV receives the new question bank automatically. A question already in progress is not interrupted; the new bank is used for the next player.

## How the pages are separated

- `index.html`: public player-only kiosk screen. No question editing panel.
- `organizer.html`: private email/password login and question editor.
- `firebase-config.js`: public Firebase Web App configuration placeholders.
- `cloud-sync.js`: TV-side anonymous sign-in and live database listener.

The shared question bank is hosted by Firebase, not in browser storage alone. The TV also keeps a local cached copy as a fallback if the network drops after the questions have already synced. The game still needs internet to receive brand-new edits.

## Important operating notes

- Use the same published GitHub Pages URLs for the TV and organizer.
- Do not share the organizer password with players.
- Keep at least one strong organizer account. Add other organizers in Firebase Authentication only if you intend to let them edit; then update the database rules to authorize them.
- Export a question backup from the organizer page before major changes.
- Firebase usage and any billing are controlled in your Firebase project. Check the Firebase Console usage/billing page for the current plan and usage.
