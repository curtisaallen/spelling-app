"use client";
import Link from "next/link";
import Image from "next/image";


export default function HomePage() {
    return (
  <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">

    <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-blue-600
         animate__animated animate__bounce animate__infinite animate__slower">
          Learn to Spell
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-700 leading-relaxed">
          Help kids master spelling with our interactive, colorful, and engaging
          word games. Perfect for young learners!
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">

          <Link href="/practice" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 text-white px-5 py-3 text-sm font-semibold shadow-md hover:opacity-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Start Practice Now!
          </Link>  


          <Link href="/practice" className="inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,hsl(25_100%_60%),hsl(40_100%_65%))] text-white px-5 py-3 text-sm font-semibold shadow-md hover:opacity-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 lucide lucide-book-open text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  data-lov-id="src/pages/Index.tsx:82:16" data-lov-name="BookOpen" data-component-path="src/pages/Index.tsx" data-component-line="82" data-component-file="Index.tsx" data-component-name="BookOpen" data-component-content="%7B%22className%22%3A%22h-8%20w-8%20text-primary-foreground%22%7D"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
            Create a Spelling List
          </Link> 

        </div>


        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> No account needed
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Kid-friendly design
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Educational content
          </li>
        </ul>
      </div>


      <div className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
                src="/images/hero-learning-BJgSU5-1.jpg"
                alt="Kids happily learning letters and spelling"
                fill
                priority
                className="object-cover"
                sizes="100vw"
            />
            </div>
      </div>
    </section>


    <section className="mt-16 md:mt-24 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-blue-600">
        Why Kids Love Our Spelling Game
      </h2>
      <p className="mt-3 max-w-2xl mx-auto text-slate-600">
        Designed with children in mind, our game makes learning spelling fun and rewarding.
      </p>
    </section>

    <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center items-center ">
        <div className="w-12 h-12 rounded-xl text-white grid place-items-center bg-[linear-gradient(135deg,hsl(210_100%_56%),hsl(199_100%_50%))]">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open h-8 w-8 text-primary-foreground" data-lov-id="src/pages/Index.tsx:82:16" data-lov-name="BookOpen" data-component-path="src/pages/Index.tsx" data-component-line="82" data-component-file="Index.tsx" data-component-name="BookOpen" data-component-content="%7B%22className%22%3A%22h-8%20w-8%20text-primary-foreground%22%7D"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
        </div>
        <h3 className="mt-4 font-semibold text-lg text-slate-600">Interactive Learning</h3>
        <p className="mt-2 text-sm text-slate-600">
          Touch, click, and interact with letters to spell words. Large buttons perfect for small fingers!
        </p>
      </div>

    
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-xl bg-amber-100 text-white grid place-items-center bg-[linear-gradient(135deg,hsl(25_100%_60%),hsl(40_100%_65%))]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users h-8 w-8 text-secondary-foreground" data-lov-id="src/pages/Index.tsx:92:16" data-lov-name="Users" data-component-path="src/pages/Index.tsx" data-component-line="92" data-component-file="Index.tsx" data-component-name="Users" data-component-content="%7B%22className%22%3A%22h-8%20w-8%20text-secondary-foreground%22%7D"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <h3 className="mt-4 font-semibold text-lg text-slate-600">Kid-Friendly Design</h3>
        <p className="mt-2 text-sm text-slate-600">
          Bright colors, fun animations, and encouraging feedback keep children engaged and motivated.
        </p>
      </div>


      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-white grid place-items-center bg-[linear-gradient(135deg,hsl(142_76%_50%),hsl(155_70%_55%))]">
     
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play h-8 w-8 text-success-foreground" data-lov-id="src/pages/Index.tsx:102:16" data-lov-name="Play" data-component-path="src/pages/Index.tsx" data-component-line="102" data-component-file="Index.tsx" data-component-name="Play" data-component-content="%7B%22className%22%3A%22h-8%20w-8%20text-success-foreground%22%7D"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
        </div>
        <h3 className="mt-4 font-semibold text-lg text-slate-600">Progressive Difficulty</h3>
        <p className="mt-2 text-sm text-slate-600">
          Start with easy words and progress to more challenging ones as skills improve.
        </p>
      </div>
    </section>




  </main>
    );
}