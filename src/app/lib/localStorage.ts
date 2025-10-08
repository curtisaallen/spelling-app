const KEY = "spelling-app";

export type PersistShape = {
  lists?: unknown; 
};

export function loadState<S = PersistShape>(): S | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as S) : undefined;
  } catch {
    return undefined;
  }
}

export function saveState(state: PersistShape): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // no-op
  }
}