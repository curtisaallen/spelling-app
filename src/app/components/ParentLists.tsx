"use client";
import { useAppSelector } from "../lib/hooks";

export default function ParentLists() {
  const { lists, activeListId } = useAppSelector((s) => s.lists);
  const active = lists.find((l) => l.id === activeListId);

  return (
    <>
      <h3>Word Lists</h3>
      <ul>
        {lists.map((l) => (
          <li key={l.id}>
            {l.name} <small>({l.words.length} words)</small>
          </li>
        ))}
      </ul>

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
    </>
  );
}