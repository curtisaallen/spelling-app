import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counterSlice";
import listsReducer from "../features/listsSlice";
import sessionReducer from "../features/sessionSlice";

export const store = configureStore({
reducer: {
counter: counterReducer,
lists: listsReducer,
session: sessionReducer,
},
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;