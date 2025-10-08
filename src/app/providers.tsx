"use client";
import { Provider } from "react-redux";
import { store } from "./lib/store";
import { useSyncLists } from "./lib/useSyncLists";

function SyncGate({ children }: { children: React.ReactNode }) {
  useSyncLists();
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SyncGate>{children}</SyncGate>
    </Provider>
  );
}