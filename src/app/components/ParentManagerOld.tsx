"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { addList, setActiveList } from "../features/listsSlice";

function parseWords(raw: string) {
  return raw
    .split(/[\n,;|\t]/g)
    .map(w => w.trim())
    .filter(Boolean);
}

export default function ParentManager() {
  const dispatch = useAppDispatch();
  const { lists, activeListId } = useAppSelector(s => s.lists);

  const [name, setName] = useState("");
  const [wordsText, setWordsText] = useState("");

  const active = lists.find(l => l.id === activeListId);

  function createList() {
    const words = parseWords(wordsText);
    if (!name || words.length === 0) return;
    dispatch(addList(name, words));
    setName("");
    setWordsText("");
  }

  return (
    <>
      <h3>Word Lists</h3>

      <label htmlFor="list" style={{ display: "block", marginBottom: 8 }}>
        Active list
      </label>
      <select
        id="list"
        value={activeListId}
        onChange={e => dispatch(setActiveList(e.target.value))}
        style={{ marginBottom: 16 }}
      >
        {lists.map(l => (
          <option key={l.id} value={l.id}>
            {l.name} ({l.words.length})
          </option>
        ))}
      </select>

      {active && (
        <>
          <h4 style={{ marginTop: 16 }}>Active List: {active.name}</h4>
          <ol>
            {active.words.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ol>
        </>
      )}

      <hr style={{ margin: "24px 0" }} />

      <h3>Create New List</h3>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="List name (e.g., Grade 1 – Week 3)"
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />
      <textarea
        value={wordsText}
        onChange={e => setWordsText(e.target.value)}
        placeholder="Enter words separated by comma or newline"
        rows={6}
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />
      <button onClick={createList}>Add List</button>
    </>
  );
}
