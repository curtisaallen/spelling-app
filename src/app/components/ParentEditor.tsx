"use client";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { updateList, removeList, importCSV, type WordList } from "../features/listsSlice";

import { auth } from "../lib/firebase"; // <-- your firebase init that exports `auth`
import { onAuthStateChanged, type User } from "firebase/auth";
import { updateUserList, deleteUserList } from "../lib/firebase/lists"; 
// helpers you created alongside `addUserList`
// updateUserList(uid, listId, { name, words })
// deleteUserList(uid, listId)

function parseWords(raw: string) {
  return raw.split(/[\n,;|\t,]/g).map((w) => w.trim()).filter(Boolean);
}

export default function ParentEditor() {
  const dispatch = useAppDispatch();
  const { lists, activeListId } = useAppSelector((s) => s.lists);
  const active = useMemo(() => lists.find((l) => l.id === activeListId), [lists, activeListId]);

  const [name, setName] = useState("");
  const [wordsText, setWordsText] = useState("");
  const [csvName, setCsvName] = useState("");
  const [csvText, setCsvText] = useState("");

  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [busySave, setBusySave] = useState(false);
  const [busyDelete, setBusyDelete] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

useEffect(() => {
  if (!active) {
    setName("");
    setWordsText("");
    return;
  }
  setName(active.name);
  setWordsText(active.words.join("\n"));
}, [active]);

  if (!active) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mt-5">
        <p className="text-slate-600">No active list selected.</p>
      </section>
    );
  }

async function save() {
  if (!active) return; // guard for TS & runtime
  const words = parseWords(wordsText);
  const next: WordList = {
    id: active.id,
    name: name || active.name,
    words: words.length ? words : active.words,
  };

  dispatch(updateList(next));

  if (!user) return;
  try {
    setBusySave(true);
    await updateUserList(user.uid, next.id, { name: next.name, words: next.words });
  } catch (e) {
    console.error("Failed to save list:", e);
    alert("Could not save to the cloud. Your local changes are still applied.");
  } finally {
    setBusySave(false);
  }
}


async function remove() {
  if (!active) return; // guard
  if (!confirm(`Delete list "${active.name}"? This cannot be undone.`)) return;

  dispatch(removeList(active.id));

  if (!user) return;
  try {
    setBusyDelete(true);
    await deleteUserList(user.uid, active.id);
  } catch (e) {
    console.error("Failed to delete list:", e);
    alert("Could not delete from the cloud. (It was removed locally.)");
  } finally {
    setBusyDelete(false);
  }
}

  function doImportCSV() {
    if (!csvName || !csvText.trim()) return;
    // This creates a NEW list locally; if you want it persisted,
    // your useSyncLists listener will push the local change up on next save cycle,
    // or you can provide an explicit `addUserList` flow like in ParentManager.
    dispatch(importCSV({ name: csvName, csv: csvText }));
    setCsvName("");
    setCsvText("");
  }

function exportJSON() {
  if (!active) return; // guard
  const data = JSON.stringify(active, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${active.name.replace(/[^a-z0-9-_]/gi, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mt-5">
      <h3 className="text-2xl font-bold text-slate-900 mb-4">Edit Active List</h3>

      {/* Accordion: Edit Fields */}
      <details className="group rounded-xl border border-slate-200 mb-4 open:shadow-sm" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="text-base font-semibold text-slate-800">Edit Fields</span>
          <span className="transition-transform group-open:rotate-180 text-slate-500">▾</span>
        </summary>
        <div className="px-5 pb-5">
          {!user && (
            <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              You’re editing locally. <strong>Sign in</strong> to save changes to your account.
            </div>
          )}

          <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="List name"
            className="w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 mb-3"
          />

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Words (one per line or comma-separated)
          </label>
          <textarea
            value={wordsText}
            onChange={(e) => setWordsText(e.target.value)}
            rows={8}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 mb-4"
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={save}
              disabled={busySave}
              className="px-5 h-11 rounded-md text-white bg-gradient-to-r from-sky-400 to-blue-500 shadow-sm hover:opacity-95 disabled:opacity-60"
            >
              {busySave ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={exportJSON}
              className="px-5 h-11 rounded-md border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            >
              Export JSON
            </button>
            <button
              onClick={remove}
              disabled={busyDelete}
              className="px-5 h-11 rounded-md text-white bg-gradient-to-r from-rose-400 to-rose-500 shadow-sm hover:opacity-95 disabled:opacity-60"
            >
              {busyDelete ? "Deleting..." : "Delete List"}
            </button>
          </div>
        </div>
      </details>

      {/* Accordion: Import CSV */}
      <details className="group rounded-xl border border-slate-200 open:shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="text-base font-semibold text-slate-800">Import CSV (create a new list)</span>
          <span className="transition-transform group-open:rotate-180 text-slate-500">▾</span>
        </summary>
        <div className="px-5 pb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">New list name</label>
          <input
            value={csvName}
            onChange={(e) => setCsvName(e.target.value)}
            placeholder="New list name (e.g., Week 4)"
            className="w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 mb-3"
          />

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Words (comma or newline separated)
          </label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Paste words separated by comma or newline"
            rows={4}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 mb-4"
          />

          <button
            onClick={doImportCSV}
            className="px-5 h-11 rounded-md text-white bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm hover:opacity-95"
          >
            Import CSV
          </button>
        </div>
      </details>
    </section>
  );
}
