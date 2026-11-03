# IIEE GAME — Power Challenge

A touchscreen electrical-engineering quiz for event kiosks.

## Live game pages

- **TV / Player Mode:** https://chrisgubat1997-cell.github.io/IIEE-GAME/
- **Private Organizer Portal:** https://chrisgubat1997-cell.github.io/IIEE-GAME/organizer.html

## How it works

The TV is player-only. An organizer signs in on a phone or laptop, edits the question bank, and saves it to Firebase Realtime Database. Connected TVs receive question changes live; the current round is allowed to finish, and the updated bank is used from the next player.

## First-time setup

Follow [FIREBASE-SETUP.md](./FIREBASE-SETUP.md) before using live editing. Set the Firebase Web App values in [firebase-config.js](./firebase-config.js), enable Email/Password and Anonymous Authentication, create the Realtime Database, and publish the restricted database rules.

Never leave the database in public test mode. Only the authorized organizer email should have write permission.

## Files

- `index.html` — public TV game
- `organizer.html` — private question editor
- `cloud-sync.js` — TV live-sync listener
- `firebase-config.js` — Firebase Web App configuration placeholders
- `FIREBASE-SETUP.md` — setup and security instructions
