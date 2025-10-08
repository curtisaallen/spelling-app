"use client";
import Link from "next/link";

export default function TopHeader() {
    return (
<nav className="w-full backdrop-blur border-b border-slate-100">
  <div className="max-w-6xl mx-auto px-4 md:px-6">
    <div className="flex h-16 items-center justify-between">

        <Link className="text-xl font-semibold text-blue-600" href="/">
                <span className="align-[-2px]">🚀</span>
                Spelling Training
        </Link>

      <ul className="hidden md:flex items-center gap-8 text-slate-700">
        <li>
            <Link className="hover:text-slate-900" href="/practice">
               Practice Your Words
            </Link>
        </li>
        <li>
            <Link className="hover:text-slate-900" href="/test">
               Online Spelling Test
            </Link>
        </li>
        <li>
            <Link className="hover:text-slate-900" href="/parent">
               Create a Spelling List
            </Link>
        </li>
      </ul>


      <div className="flex items-center gap-6">
        <a href="#" className="hidden md:inline-block font-semibold tracking-wide text-slate-900">LOG IN</a>
        <a
          href="#"
          className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white
                 bg-gradient-to-b from-slate-800 to-slate-700 shadow-lg shadow-slate-900/10 hover:opacity-95">
          SIGN IN
        </a>


        <button className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:bg-slate-100" aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>
    )
}
