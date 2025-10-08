import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Mode = "idle" | "practice" | "test" | "finished";

export type SessionState = {
  mode: Mode;
  currentIndex: number;
  answers: string[];      // used in Test mode
  correctCount: number;   // used in Practice (first-try corrects)
  showHint: boolean;      // used in Practice
  startedAt?: number;
  finishedAt?: number;
  points: number;
};

const initialState: SessionState = {
  mode: "idle",
  currentIndex: 0,
  answers: [],
  correctCount: 0,
  showHint: false,
  points: 0,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    // Practice flow
    startPractice(state) {
      state.mode = "practice";
      state.currentIndex = 0;
      state.correctCount = 0;
      state.answers = [];
      state.showHint = false;
      state.startedAt = Date.now();
      state.finishedAt = undefined;
      state.points = 0;
    },
    submitPractice(state, action: PayloadAction<{ correct: boolean }>) {
      if (action.payload.correct) state.correctCount += 1;
      state.currentIndex += 1;
      state.showHint = false;
    },
    toggleHint(state) {
      state.showHint = !state.showHint;
    },

    // Test flow
    startTest(state) {
      state.mode = "test";
      state.currentIndex = 0;
      state.correctCount = 0;
      state.answers = [];
      state.showHint = false; // no hint in test, but keep consistent
      state.startedAt = Date.now();
      state.finishedAt = undefined;
      state.points = 0;
    },
 submitTestAnswer: (state, action: PayloadAction<{ answer: string; correct: boolean }>) => {
  const { answer, correct } = action.payload;
  state.answers[state.currentIndex] = answer;
  if (correct) { state.points += 10; }
},
    next(state) {
      state.currentIndex += 1;
      state.showHint = false;
    },

    // Shared
    finish(state) {
      state.mode = "finished";
      state.finishedAt = Date.now();
    },
    resetSession() {
      return initialState;
    },
  },
});

export const {
  startPractice,
  submitPractice,
  toggleHint,
  startTest,
  submitTestAnswer,
  next,
  finish,
  resetSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
