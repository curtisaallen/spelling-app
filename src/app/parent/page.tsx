import GameShell from "../components/GameShell";
import ParentManager from "../components/ParentManager";
import ParentEditor from "../components/ParentEditor";

export default function ParentPage() {
  return (
  <GameShell title="Parent">
    <ParentManager />
    <ParentEditor />
  </GameShell>
  );
}