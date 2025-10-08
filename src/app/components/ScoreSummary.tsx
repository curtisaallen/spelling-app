"use client";
import { useMemo } from "react";

export default function ScoreSummary({
  words,
  answers,
  onRetake,
}: {
  words: string[];
  answers: string[];
  onRetake: () => void;
}) {
  const score = useMemo(
    () =>
      words.filter(
        (w, i) => (answers[i] ?? "").trim().toLowerCase() === w.toLowerCase()
      ).length,
    [words, answers]
  );

  return (
<section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
  {/* Header */}
  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
    <h3 className="text-2xl font-bold text-slate-900">Results</h3>

    {/* Score pill */}
    <div className="rounded-2xl shadow-lg bg-gradient-to-b from-sky-400 to-sky-500 text-white px-5 py-3 grid place-items-center">
      <div className="flex items-center gap-2 text-white/95">
        {/* star icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <span className="text-xs">Score</span>
      </div>
      <div className="text-2xl font-bold leading-none">{score} / {words.length}</div>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm">
      <caption className="sr-only">Spelling results</caption>
      <thead>
        <tr className="bg-slate-50 text-slate-600">
          <th scope="col" className="px-4 py-3 font-semibold">#</th>
          <th scope="col" className="px-4 py-3 font-semibold">Word</th>
          <th scope="col" className="px-4 py-3 font-semibold">Your Answer</th>
          <th scope="col" className="px-4 py-3 font-semibold">Correct?</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {words.map((w, i) => {
          const a = (answers[i] ?? "").trim();
          const ok = a.toLowerCase() === w.toLowerCase();

          return (
            <tr
              key={i}
            >
              <td className="px-4 py-3 tabular-nums">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{w}</td>
              <td className="px-4 py-3 text-slate-700">{a || "—"}</td>
              <td className="px-4 py-3">
                {ok ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 text-emerald-700 px-2 py-1 text-xs font-semibold">
                    {/* check icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                    </svg>
                    Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 text-rose-700 px-2 py-1 text-xs font-semibold">
                    {/* x icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L12 13.41 5.71 19.7 4.3 18.29 10.59 12 4.3 5.71 5.71 4.29 12 10.59 18.29 4.29z" />
                    </svg>
                    Incorrect
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  {/* Footer actions */}
  <div className="mt-6 flex justify-center">
    <button
      onClick={onRetake}
      className="px-6 h-11 rounded-md text-white shadow-md bg-gradient-to-r from-sky-400 to-blue-500 hover:opacity-95"
    >
      Retake
    </button>
  </div>
</section>

  );
}
