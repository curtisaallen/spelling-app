import GameShell from "../components/GameShell";
import WordListPicker from "../components/WordListPicker";
import TestRunner from "../components/TestRunner";

export default function TestPage() {
  return (

      <>
     <section className="max-w-4xl mx-auto px-4 md:px-8 md:py-14"> 

            <GameShell title="Test">
            <WordListPicker />
            <TestRunner  />
            </GameShell>

    </section>   


            </>
  );
}
