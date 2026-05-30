"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-blue-900 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:text-blue-200 transition">
          <span className="text-2xl">🏥</span>
          <span>Mini Consultório</span>
        </Link>

        {/* Links de Navegação */}
        <div className="flex items-center gap-6">
          <Link
            href="/faca-o-osce"
            className={`font-semibold transition ${
              isActive("/faca-o-osce")
                ? "text-blue-300 border-b-2 border-blue-300 pb-1"
                : "hover:text-blue-200"
            }`}
          >
            Prova OSCE
          </Link>

          <Link
            href="/treinamento"
            className={`font-semibold transition ${
              isActive("/treinamento")
                ? "text-blue-300 border-b-2 border-blue-300 pb-1"
                : "hover:text-blue-200"
            }`}
          >
            Treinamento
          </Link>
        </div>
      </div>
    </nav>
  );
}
