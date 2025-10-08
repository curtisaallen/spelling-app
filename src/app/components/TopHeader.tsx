"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import Image from "next/image";

function AuthButtons() {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  async function login() {
    try {
      setBusy(true);
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Google sign-in failed:", e);
      alert("Google sign-in failed. Check console for details.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try {
      setBusy(true);
      await signOut(auth);
    } catch (e) {
      console.error("Sign out failed:", e);
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={login}
          disabled={busy}
          className="hidden md:inline-block font-semibold tracking-wide text-slate-900 hover:text-slate-700 disabled:opacity-60"
        >
          LOG IN
        </button>
        <button
          onClick={login}
          disabled={busy}
          className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white
                     bg-gradient-to-b from-slate-800 to-slate-700 shadow-lg shadow-slate-900/10 hover:opacity-95 disabled:opacity-60"
        >
          GOOGLE SIGN IN
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-2">
        {user.photoURL ? (
          <Image 
            src={user.photoURL}
            alt={user.displayName ?? "User"}
            className="h-8 w-8 rounded-full"
            referrerPolicy="no-referrer"
          priority />
        ) : (
          <div className="h-8 w-8 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-sm">
            {(user.displayName?.[0] ?? "U").toUpperCase()}
          </div>
        )}
        <span className="text-sm text-slate-600">
          {user.displayName ?? user.email}
        </span>
      </div>

      <button
        onClick={logout}
        disabled={busy}
        className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium
                   border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 disabled:opacity-60"
      >
        Sign out
      </button>
    </div>
  );
}

export default function TopHeader() {
  return (
    <nav className="w-full backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link className="text-xl font-semibold text-blue-600" href="/">
            <span className="align-[-2px]">🚀</span>
            Spell It Right!
          </Link>

          <ul className="hidden md:flex items-center gap-8 text-slate-700">
            <li>
              <Link className="hover:text-slate-900" href="/practice">
                Practice Your Words
              </Link>
            </li>
            <li>
              <Link className="hover:text-slate-900" href="/test">
                Online Spelling Test
              </Link>
            </li>
            <li>
              <Link className="hover:text-slate-900" href="/parent">
                Create a Spelling List
              </Link>
            </li>
          </ul>

          {/* Auth */}
          <div className="flex items-center gap-6">
            <AuthButtons />

            {/* mobile menu button (unchanged) */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
