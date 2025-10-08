"use client";
import { useRef } from "react";

export function useSpeech() {
  const last = useRef<SpeechSynthesisUtterance | null>(null);

  function speak(text: string, rate = 0.9) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (last.current) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate; // slightly slower for kids
    last.current = u;
    window.speechSynthesis.speak(u);
  }

  function cancel() {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
  }

  return { speak, cancel };
}
