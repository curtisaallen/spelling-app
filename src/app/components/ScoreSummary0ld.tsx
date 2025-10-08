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
    <div className="card pad">
      <h3>Results</h3>
      <p>Score: {score} / {words.length}</p>

      <table className="results">
        <thead>
          <tr>
            <th>#</th>
            <th>Word</th>
            <th>Your Answer</th>
            <th>Correct?</th>
          </tr>
        </thead>
        <tbody>
          {words.map((w, i) => {
            const a = (answers[i] ?? "").trim();
            const ok = a.toLowerCase() === w.toLowerCase();
            return (
              <tr key={i} className={ok ? "ok" : "bad"}>
                <td>{i + 1}</td>
                <td>{w}</td>
                <td>{a || "—"}</td>
                <td>{ok ? "✓" : "✗"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button onClick={onRetake} style={{ marginTop: 12 }}>Retake</button>
    </div>
  );
}
