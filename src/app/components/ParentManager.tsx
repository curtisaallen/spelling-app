"use client";
import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { setActiveList } from "../features/listsSlice";

import { auth } from "../lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { addUserList } from "../lib/firebase/lists";

function parseWords(raw: string) {
  return raw.split(/[\n,;|\t]/g).map(w => w.trim()).filter(Boolean);
}

export default function ParentManager() {
  const dispatch = useAppDispatch();
  const { lists, activeListId } = useAppSelector(s => s.lists);

  const [name, setName] = useState("");
  const [wordsText, setWordsText] = useState("");
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const active = useMemo(
    () => lists.find(l => l.id === activeListId),
    [lists, activeListId]
  );

  async function createList() {
    const words = parseWords(wordsText);
    if (!name || words.length === 0) return;
    if (!user) {
      alert("Please sign in to save lists.");
      return;
    }
    try {
      setBusy(true);
      // Save to Firestore and get the new doc id
      const newId = await addUserList(user.uid, name, words);
      // Make it the active list locally
      dispatch(setActiveList(newId));
      // Reset inputs
      setName("");
      setWordsText("");
      // Redux will refresh from Firestore if you mounted useSyncLists()
    } catch (e) {
      console.error("Failed to create list:", e);
      alert("Could not create list. Check console for details.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mt-5">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Word Lists</h2>

      {/* Accordion: Choose Active List */}
      <details className="group rounded-xl border border-slate-200 mb-4 open:shadow-sm" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="text-base font-semibold text-slate-800">Active List</span>
          <span className="transition-transform group-open:rotate-180 text-slate-500">▾</span>
        </summary>
        <div className="px-5 pb-5">
          <label htmlFor="list" className="block text-sm font-medium text-slate-700 mb-2">
            Choose active list
          </label>
          <select
            id="list"
            value={activeListId}
            onChange={e => dispatch(setActiveList(e.target.value))}
            className="w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            {lists.map(l => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.words.length})
              </option>
            ))}
          </select>
        </div>
      </details>

      {/* Accordion: Preview Active List */}
      <details className="group rounded-xl border border-slate-200 mb-4 open:shadow-sm" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="text-base font-semibold text-slate-800">
            {active ? `Preview: ${active.name}` : "Preview Active List"}
          </span>
          <span className="transition-transform group-open:rotate-180 text-slate-500">▾</span>
        </summary>
        <div className="px-5 pb-5">
          {!active ? (
            <p className="text-slate-600">No active list selected.</p>
          ) : active.words.length === 0 ? (
            <p className="text-slate-600">This list has no words yet.</p>
          ) : (
            <ol className="list-decimal pl-6 space-y-1 text-slate-800">
              {active.words.map((w, i) => (
                <li key={i} className="leading-6">{w}</li>
              ))}
            </ol>
          )}
        </div>
      </details>

      {/* Accordion: Create New List */}
      <details className="group rounded-xl border border-slate-200 open:shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="text-base font-semibold text-slate-800">Create New List</span>
          <span className="transition-transform group-open:rotate-180 text-slate-500">▾</span>
        </summary>
        <div className="px-5 pb-5">
          {!user && (
            <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Please sign in to save lists to your account.
            </div>
          )}

          <label className="block text-sm font-medium text-slate-700 mb-2">
            List name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Grade 1 – Week 3"
            className="w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 mb-3"
          />

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Words (comma or newline separated)
          </label>
          <textarea
            value={wordsText}
            onChange={e => setWordsText(e.target.value)}
            rows={6}
            placeholder={`cat, dog, fish
blue
yellow`}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 mb-4"
          />

          <button
            onClick={createList}
            disabled={busy || !user}
            className="px-5 h-11 rounded-md text-white bg-gradient-to-r from-sky-400 to-blue-500 shadow-sm hover:opacity-95 disabled:opacity-60"
          >
            {busy ? "Adding..." : "Add List"}
          </button>
        </div>
      </details>
    </section>
  );
}
