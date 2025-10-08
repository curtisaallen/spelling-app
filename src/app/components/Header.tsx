"use client";
import Link from "next/link";


export default function Header() {
return (
<header className="site-header">
<Link href="/" className="brand-pill">🅂 Spelling</Link>
<nav>
<Link href="/practice">Practice</Link>
<Link href="/test">Test</Link>
<Link href="/parent">Parent</Link>
</nav>
</header>
);
}