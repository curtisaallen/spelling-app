import PracticePad from "../components/PracticePad";
import ScoreBorad from "../components/ScoreBorad";
import WordListPickerCP from "../components/WordListPickerCP";

export default function PracticePage() {
return (
      <>
<section className="max-w-4xl mx-auto px-4 md:px-8 md:py-14">   

<ScoreBorad />
<WordListPickerCP />
<PracticePad />
</section>   


            </>
);
}