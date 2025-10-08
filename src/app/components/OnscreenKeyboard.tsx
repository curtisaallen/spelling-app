"use client";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const EXTRAS = ["-", "'"]; // optional: hyphen & apostrophe

export default function OnscreenKeyboard({
  onKey,
  onBackspace,
  onEnter,
  disabled,
}: {
  onKey: (ch: string) => void;
  onBackspace?: () => void;
  onEnter?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 justify-items-center mt-6" aria-label="On-screen keyboard">
      {LETTERS.map((L) => (
        <button
          key={L}
          className="key px-4 py-2 h-10 rounded-full text-white font-medium shadow-md bg-gradient-to-r from-sky-400 to-blue-500 hover:opacity-95 active:scale-[.98] transition"
          onClick={() => onKey(L.toLowerCase())}
          disabled={disabled}
          type="button"
          aria-label={L}
        >
          {L}
        </button>
      ))}

      {EXTRAS.map((x) => (
        <button
          key={x}
          className="key"
          onClick={() => onKey(x)}
          disabled={disabled}
          type="button"
          aria-label={x === "-" ? "hyphen" : "apostrophe"}
        >
          {x}
        </button>
      ))}

      <button
        className="key"
        onClick={onBackspace}
        disabled={disabled}
        type="button"
        aria-label="Backspace"
      >
        ⌫
      </button>
      <button
        className="key"
        onClick={onEnter}
        disabled={disabled}
        type="button"
        aria-label="Enter"
      >
        Enter
      </button>
    </div>
  );
}
