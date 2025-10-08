"use client";
import { useMemo, useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";  // use "../lib/hooks" if not using alias
import { startTest, submitTestAnswer, next, finish, resetSession } from "../features/sessionSlice";
import ScoreSummary from "../components/ScoreSummary";           // use "../components/ScoreSummary" if needed
import OnscreenKeyboard from "../components/OnscreenKeyboard";   // optional, remove if not using
import { useSpeech } from "../lib/useSpeech";

export default function TestRunner() {
  const dispatch = useAppDispatch();
  const { lists, activeListId } = useAppSelector((s) => s.lists);
  const session = useAppSelector((s) => s.session);
  const { speak, cancel } = useSpeech();

  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    cancel();      // stop any in-progress speech
    setValue("");  // clear input
    // go back to Start Test screen whenever list changes
    dispatch(resetSession());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeListId]);  // ← only depend on the list id

  const words = useMemo(
    () => lists.find((l) => l.id === activeListId)?.words ?? [],
    [lists, activeListId]
  );
  const current = words[session.currentIndex] ?? "";
  const total = words.length;

  function handleStart() {
    //dispatch(resetSession());
    dispatch(startTest());
    setValue("");
    setTimeout(() => {
      if (words[0]) speak(words[0]);
      inputRef.current?.focus();
    }, 80);
  }

  // 🔧 UPDATED: compute correctness and send the expected payload object
  function submitAndNext() {
    const userAnswer = value.trim();
    const correctWord = String(words[session.currentIndex] ?? "").trim();
    const correct = userAnswer.toLowerCase() === correctWord.toLowerCase();

    // Your slice expects: { answer: string; correct: boolean }
    dispatch(submitTestAnswer({ answer: userAnswer, correct }));

    const nextIndex = session.currentIndex + 1;
    const isLast = nextIndex >= words.length;

    setValue("");

    if (isLast) {
      dispatch(finish());
    } else {
      dispatch(next());
      setTimeout(() => speak(words[nextIndex] ?? ""), 60);
      inputRef.current?.focus();
    }
  }

  if (words.length === 0) {
    return <div className="rounded-2xl border bg-white shadow-sm p-6 md:p-8 text-center mt-5"><p>No words in the active list.</p></div>;
  }

  if (session.mode === "idle") {
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-6 md:p-8 text-center mt-5">
        <h2 className="mb-4 text-center text-2xl font-bold text-slate-800">Click start to take the test. You’ll hear each word once per question.</h2>
        <button className="px-5 h-11 rounded-md text-white bg-gradient-to-r from-sky-400 to-blue-500 shadow-sm hover:opacity-95" onClick={handleStart}>Start Test</button>
      </div>
    );
  }

  if (session.mode === "finished") {
    return (
      <ScoreSummary
        words={words}
        answers={session.answers}
        onRetake={handleStart}
      />
    );
  }

  // Active question
  const progress = total > 0 ? Math.min(100, (session.currentIndex / total) * 100) : 0;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mt-5 text-slate-800">

      <div className="prompt-row mb-6 md:mb-8" style={{ display: "flex", gap: 8 }}>
        <button className="px-4 h-10 rounded-md text-white shadow-sm bg-gradient-to-r from-sky-400 to-blue-500 hover:opacity-95 transition" onClick={() => speak(current)}>🔊 Say it</button>
        <button className="px-4 h-10 rounded-md border border-slate-200 bg-white text-slate-800 hover:bg-slate-50" onClick={submitAndNext}>Submit</button>
      </div>

      <input
        ref={inputRef}
        className="rounded-2xl border px-6 py-8 mx-auto bg-slate-50 border-slate-200 mb-6 md:mb-8 w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submitAndNext(); }}
        placeholder="Type the word you heard"
        autoCapitalize="none"
        autoComplete="off"
      />

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

      {/* Optional on-screen keyboard */}
      <OnscreenKeyboard
        onKey={(ch) => { setValue((v) => v + ch); inputRef.current?.focus(); }}
        onBackspace={() => { setValue((v) => v.slice(0, -1)); inputRef.current?.focus(); }}
        onEnter={submitAndNext}
      />
    </div>
  );
}
