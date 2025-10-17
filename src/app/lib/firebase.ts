// src/lib/firebase.ts

// No "use client" here. This file can be imported anywhere.
// We guard so nothing initializes (or throws) during SSR/prerender.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const isClient = typeof window !== "undefined";

/** Create a placeholder that throws only when actually ACCESSED/USED on the server. */
function throwingProxy<T>(name: string): T {
  const thrower = () => {
    throw new Error(
      `${name} is client-side only. Import is fine anywhere, ` +
      `but access/use it inside a Client Component (e.g., after mount).`
    );
  };
  return new Proxy(function () {} as unknown as T, {
    // property access
    get: () => thrower,
    // calling as a function
    apply: () => thrower(),
    // new Something()
    construct: () => { thrower(); },
  });
}

// Lazy singletons (populated only in the browser)
let appInstance: FirebaseApp | null = null;

if (isClient) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
    // IMPORTANT: should be "<project-id>.appspot.com"
    storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
  } as const;

  appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// Exports:
// - On the client: real instances.
// - On the server: *proxies* that only throw when accessed, never at import time.
export const app: FirebaseApp =
  (isClient && appInstance) ? appInstance : throwingProxy<FirebaseApp>("firebase app");

export const auth: Auth =
  (isClient && appInstance) ? getAuth(appInstance) : throwingProxy<Auth>("firebase auth");

export const db: Firestore =
  (isClient && appInstance) ? getFirestore(appInstance) : throwingProxy<Firestore>("firebase firestore");

export const googleProvider: GoogleAuthProvider =
  (isClient) ? new GoogleAuthProvider() : throwingProxy<GoogleAuthProvider>("google provider");
