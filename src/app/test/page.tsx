import dynamic from "next/dynamic";

// Render children only in the browser to avoid build-time Firebase/Auth
const TestClient = dynamic(() => import("./TestClient"), { ssr: false });

export default function TestPage() {
  return <TestClient />;
}
