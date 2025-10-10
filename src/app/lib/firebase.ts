// src/lib/firebase.ts

// ⚠️ Do NOT add "use client" here. We want this file importable from anywhere,
// but we guard initialization so nothing runs during SSR/prerender.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const isClient = typeof window !== "undefined";

// Lazy singletons (only populated in the browser)
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _googleProvider: GoogleAuthProvider | null = null;

// Only initialize in the browser (prevents Netlify/Next build-time crashes)
if (isClient) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
    // NOTE: For Firebase SDK config, this should be "<project-id>.appspot.com"
    // Make sure your env var is set that way in Netlify.
    storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
  };

  _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  _auth = getAuth(_app);
  _db = getFirestore(_app);
  _googleProvider = new GoogleAuthProvider();
}

// Helper that throws a clear error if someone tries to use these on the server
function serverOnly<T = unknown>(name: string): T {
  throw new Error(
    `${name} is client-side only. Import from "src/lib/firebase" is fine, `
    + `but call/use it inside a Client Component (e.g., after mount) to avoid SSR.`
  );
}

// Exports keep your current import style working:
// - In the browser: real instances
// - On the server: a throwing proxy so accidental usage fails clearly
export const app: FirebaseApp = (_app ?? serverOnly<FirebaseApp>("firebase app")) as FirebaseApp;

export const auth: Auth = (_auth ??
  new Proxy({} as Auth, {
    get() { return serverOnly<Auth>("firebase auth"); },
  })
) as Auth;

export const db: Firestore = (_db ??
  new Proxy({} as Firestore, {
    get() { return serverOnly<Firestore>("firebase firestore"); },
  })
) as Firestore;

export const googleProvider: GoogleAuthProvider = (_googleProvider ??
  new Proxy({} as GoogleAuthProvider, {
    get() { return serverOnly<GoogleAuthProvider>("google provider"); },
  })
) as GoogleAuthProvider;

