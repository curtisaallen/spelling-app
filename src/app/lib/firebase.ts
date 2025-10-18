// src/lib/firebase.ts

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const isClient = typeof window !== "undefined";

/** Returns a proxy that only throws when ACCESSED/USED on the server. */
function throwingProxy<T extends object>(name: string): T {
  const thrower = () => {
    throw new Error(
      `${name} is client-side only. Import is fine anywhere, but access/use it inside a Client Component (e.g., after mount).`
    );
  };

  const proxy = new Proxy({} as Record<string, unknown>, {
    get: () => thrower,
    set: () => {
      thrower();
      return false;
    },
    has: () => {
      thrower();
      return false;
    },
    apply: () => thrower(),
    construct: () => {
      thrower();
      return {};
    },
  });

  return proxy as unknown as T;
}

// Lazy singleton app (client only)
let appInstance: FirebaseApp | null = null;

if (isClient) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
    // IMPORTANT: this should be "<project-id>.appspot.com"
    storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
  } as const;

  appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// Exports:
// - Client: real instances
// - Server: safe proxies that don't throw until actually touched
export const app: FirebaseApp =
  (isClient && appInstance) ? appInstance : throwingProxy<FirebaseApp>("firebase app");

export const auth: Auth =
  (isClient && appInstance) ? getAuth(appInstance) : throwingProxy<Auth>("firebase auth");

export const db: Firestore =
  (isClient && appInstance) ? getFirestore(appInstance) : throwingProxy<Firestore>("firebase firestore");

export const googleProvider: GoogleAuthProvider =
  isClient ? new GoogleAuthProvider() : throwingProxy<GoogleAuthProvider>("google provider");
