// src/app/lib/useSyncLists.ts
"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase"; // adjust path if different
import {
  fetchUserLists,
  watchUserLists,
  addUserList,
} from "../lib/firebase/lists";
import { useAppDispatch } from "../lib/hooks";
import {
  replaceAllLists,
  clearAllLists,
  type WordList,
} from "@/app/features/listsSlice";

// Demo data to seed a first-time signed-in user
const demoLists: WordList[] = [
  {
    id: "demo1",
    name: "Demo: Grade 2 – Animals",
    words: ["cat", "dog", "fish", "bird", "tiger", "horse", "mouse", "sheep", "whale", "eagle"],
  },
  {
    id: "demo2",
    name: "Demo: Sight Words",
    words: ["the", "and", "with", "play", "make", "like", "just", "they", "from", "little"],
  },
];

export function useSyncLists() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let stopWatch: undefined | (() => void);

    const stopAuth = onAuthStateChanged(auth, async (user) => {
      // Signed out: show ONLY seed lists
      if (!user) {
        if (typeof stopWatch === "function") stopWatch();
        dispatch(clearAllLists());
        return;
      }

      // Signed in: fetch user's lists once
      const remoteOnce = await fetchUserLists(user.uid);

      // First-time user: seed Firestore with demos
      if (remoteOnce.length === 0) {
        for (const l of demoLists) {
          // addUserList generates its own Firestore id; we don't rely on demo ids
          await addUserList(user.uid, l.name, l.words);
        }
        // re-read after seeding
        const afterSeed = await fetchUserLists(user.uid);
        dispatch(replaceAllLists(afterSeed)); // slice merges seeds + user
      } else {
        dispatch(replaceAllLists(remoteOnce)); // slice merges seeds + user
      }

      // Start realtime listener for this user
      stopWatch = watchUserLists(user.uid, (liveLists) => {
        // Always merge live user lists with seeds
        dispatch(replaceAllLists(liveLists));
      });
    });

    return () => {
      if (typeof stopWatch === "function") stopWatch();
      stopAuth();
    };
  }, [dispatch]);
}
