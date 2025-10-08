"use client";
import { useMemo } from "react";
import {  useAppSelector } from "../lib/hooks";
export default function ScoreBorad() {
    const session = useAppSelector((s) => s.session);
    const { lists, activeListId } = useAppSelector((s) => s.lists);
    const words = useMemo(
        () => lists.find((l) => l.id === activeListId)?.words ?? [],
        [lists, activeListId]
    );
    const total = words.length;

    if (session.mode != "idle") {

  const wordsDone = Math.min(session.currentIndex, total);
  const correct = session.correctCount ?? 0;      // from your reducer
  const points = correct * 10; 

return (
   <div className="flex justify-center gap-4 mb-5">
        <div className="rounded-2xl shadow-lg bg-gradient-to-b from-sky-400 to-sky-500 text-white px-6 py-4 grid place-items-center">
          <div className="flex items-center gap-2 text-white/95">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
            <span className="text-xs">Points</span>
          </div>
          <div className="text-2xl font-bold leading-none">{points}</div>
        </div>
        <div className="rounded-2xl shadow-lg bg-gradient-to-b from-amber-400 to-orange-500 text-white px-6 py-4 grid place-items-center">
          <div className="flex items-center gap-2 text-white/95">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M17 3H7v6a5 5 0 1 0 10 0V3zm2 0v6a7 7 0 1 1-14 0V3H3v2h2v1H3v2h2a7 7 0 1 0 14 0h2V6h-2V5h2V3h-2z"></path></svg>
            <span className="text-xs">Words</span>
          </div>
          <div className="text-2xl font-bold leading-none"> {wordsDone}</div>
        </div>
   </div>
)
    }
}