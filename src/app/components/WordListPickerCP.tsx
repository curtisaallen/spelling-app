"use client";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { setActiveList } from "../features/listsSlice";




 

export default function WordListPickerCP() {
  const dispatch = useAppDispatch();
  const { lists, activeListId } = useAppSelector((s) => s.lists);
    const session = useAppSelector((s) => s.session);


console.log(lists, "words")
   if (session.mode === "idle") {
  return (
  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 text-slate-800 mt-5">
  <h2 className="text-center text-2xl font-bold mb-5">Choose a Word List:</h2>

  <div className="mx-auto max-w-xl">
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="relative">
     <select
        id="list"
        className="h-11 w-[22rem] max-w-full appearance-none rounded-md border border-slate-300
                 bg-slate-50 px-3 pr-10 text-sm text-slate-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={activeListId}
        onChange={(e) => dispatch(setActiveList(e.target.value))}
      >
        {lists.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name} ({l.words.length})
          </option>
        ))}
      </select>


        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.18 3.31a.75.75 0 0 1-.94 0L5.25 8.39a.75.75 0 0 1-.02-1.18z" clipRule="evenodd"/>
        </svg>
      </div>
    </div>
  </div>
</section>





  );
}

    }

