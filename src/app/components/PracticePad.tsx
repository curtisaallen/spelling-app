"use client";

import { useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  startPractice,
  submitPractice,
  toggleHint,
  resetSession,
} from "../features/sessionSlice";
import { useSpeech } from "../lib/useSpeech";

export default function PracticePad() {
  const dispatch = useAppDispatch();
  const { lists, activeListId } = useAppSelector((s) => s.lists);
  const session = useAppSelector((s) => s.session);
  const { speak } = useSpeech();

  const [value, setValue] = useState("");
  const [errorFlash, setErrorFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const words = useMemo(
    () => lists.find((l) => l.id === activeListId)?.words ?? [],
    [lists, activeListId]
  );

  const current = words[session.currentIndex] ?? "";
  const total = words.length;
  const atEnd = session.mode !== "idle" && session.currentIndex >= total;

  function start() {
    dispatch(resetSession());
    dispatch(startPractice());
    setValue("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function resetGame() {
    dispatch(resetSession());
    setValue("");
  }

  function check() {
    const correct = value.trim().toLowerCase() === current.toLowerCase();
    dispatch(submitPractice({ correct }));
    setValue("");
  }

  // helpers
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const nextIndex = value.length;
  const nextExpected = (current[nextIndex] ?? "").toUpperCase();

  function flashError() {
    setErrorFlash(true);
    setTimeout(() => setErrorFlash(false), 180);
    if ("vibrate" in navigator) {
      try { navigator.vibrate?.(20); } catch {}
    }
  }

  function addChar(chRaw: string) {
    const ch = chRaw.toUpperCase();
    // don't allow typing past the word length
    if (!current || value.length >= current.length) return;

    if (ch === nextExpected) {
      setValue((v) => (v + ch).slice(0, current.length));
    } else {
      // Wrong letter: ignore and flash error.
      flashError();

      // 💡 If you want to CLEAR the entire word on wrong letter instead, use:
      // setValue("");
    }
  }

  function backspace() {
    setValue((v) => v.slice(0, -1));
    inputRef.current?.focus();
  }

  function clearWord() {
    setValue("");
    inputRef.current?.focus();
  }

  // physical keyboard support
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      check();
      return;
    }
    if (e.key === "Backspace") {
      backspace();
      return;
    }
    if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
      addChar(e.key);
    }
  };

  // --- Idle / Done states ---
  if (session.mode === "idle") {
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-6 md:p-8 text-center mt-5">
        <h2 className="mb-4 text-center text-2xl font-bold text-slate-800">
          Press start to begin practicing the active list.
        </h2>
        <div className="flex justify-center gap-3">
          <button
            className="px-5 h-11 rounded-md text-white bg-gradient-to-r from-sky-400 to-blue-500 shadow-sm hover:opacity-95"
            onClick={start}
          >
            Start Practice
          </button>
          {words[0] && (
            <button
              className="px-5 h-11 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
              onClick={() => speak(words[0])}
            >
              🔊 Hear first word
            </button>
          )}
        </div>
      </div>
    );
  }

  if (atEnd) {
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-6 md:p-8 text-center">
        <h3 className="text-xl font-bold mb-2 text-slate-600">Great job! 🎉</h3>
        <p className="text-slate-600">
          You practiced {total} words and got {session.correctCount} correct on first try.
        </p>
        <div className="mt-5">
          <button
            className="px-6 h-11 rounded-md text-white bg-gradient-to-r from-sky-400 to-blue-500 shadow-sm hover:opacity-95"
            onClick={start}
          >
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  // --- Active game card ---
  const slots = Math.max(current.length || 4, 4);
  const progress = total > 0 ? Math.min(100, (session.currentIndex / total) * 100) : 0;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mt-5">
      {/* Controls */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 h-10 rounded-md text-white shadow-sm bg-gradient-to-r from-sky-400 to-blue-500 hover:opacity-95 transition"
            onClick={() => speak(current)}
          >
            🔊 Say it
          </button>
          <button
            className="px-4 h-10 rounded-md text-white shadow-sm bg-gradient-to-r from-sky-400 to-blue-500 hover:opacity-95 transition"
            onClick={() => dispatch(toggleHint())}
          >
            💡 Hint
          </button>
          {/* Delete controls */}
          <button
            className="px-4 h-10 rounded-md border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            onClick={backspace}
            title="Delete last letter"
          >
            ⌫ Delete
          </button>
          <button
            className="px-4 h-10 rounded-md border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            onClick={clearWord}
            title="Clear typed word"
          >
            ✖︎ Clear
          </button>
        </div>
      </div>

      {/* Hint */}
      {session.showHint && (
        <div className="mb-3 text-center text-slate-600">
          <span className="inline-block rounded bg-slate-100 px-3 py-1">{current}</span>
        </div>
      )}

      {/* Word display */}
      <div className="mb-6 md:mb-8">
        <div
          className={[
            "rounded-2xl border px-6 py-8 md:px-10 md:py-10 mx-auto bg-slate-50 transition",
            errorFlash ? "ring-2 ring-rose-400 bg-rose-50" : "border-slate-200",
          ].join(" ")}
        >
          <div className="flex items-center justify-center gap-3 md:gap-5">
            {Array.from({ length: slots }).map((_, i) => {
              const ch = (value[i] ?? "").toUpperCase();
              const show = ch || "?";
              return (
                <div
                  key={i}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl border-2 border-slate-200 bg-slate-100 grid place-items-center text-2xl md:text-4xl font-bold text-slate-400"
                >
                  <span className={ch ? "text-slate-700" : ""}>{show}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-slate-600">Progress</span>
          <span className="tabular-nums text-slate-600">
            {Math.min(session.currentIndex, total)} / {total}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Hidden input for physical keyboards */}
      <input
        ref={inputRef}
        value={value}
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        className="sr-only"
        autoCapitalize="none"
        autoComplete="off"
      />

      {/* Letters grid */}
      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 justify-items-center mt-6">
        {letters.map((L) => (
          <button
            key={L}
            className="px-4 py-2 h-10 rounded-full text-white font-medium shadow-md bg-gradient-to-r from-sky-400 to-blue-500 hover:opacity-95 active:scale-[.98] transition"
            onClick={() => {
              addChar(L);
              inputRef.current?.focus();
            }}
          >
            {L}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          className="px-6 h-11 rounded-md text-white shadow-md bg-gradient-to-r from-amber-400 to-orange-500 inline-flex items-center gap-2 hover:opacity-95"
          onClick={check}
        >
          {/* star icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
            <path
              fill="currentColor"
              d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
          Check
        </button>
        <button
          className="px-6 h-11 rounded-md bg-white border border-slate-200 shadow-sm hover:bg-slate-50 inline-flex items-center text-slate-800 gap-2"
          onClick={resetGame}
        >
          {/* reset icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-slate-600">
            <path
              fill="currentColor"
              d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5 0 1.01-.3 1.95-.82 2.73l1.46 1.46A6.96 6.96 0 0 0 19 13c0-3.87-3.13-7-7-7zm-5 7c0-1.01.3-1.95.82-2.73L6.36 8.82A6.96 6.96 0 0 0 5 13c0 3.87 3.13 7 7 7v3l4-4-4-4v3c-2.76 0-5-2.24-5-5z"
            />
          </svg>
          Reset Game
        </button>
      </div>
    </section>
  );
}
