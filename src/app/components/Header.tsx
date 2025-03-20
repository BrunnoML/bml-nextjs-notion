"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState<"default" | "white">("default");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "default" ? "white" : "default"));
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-gray-800 shadow">
      {/* Título em roxo */}
      <h1 className="text-2xl font-bold text-purple-500">Brunno ML</h1>
      {/* Menu de navegação */}
      <nav className="space-x-6">
        <Link href="/" className="hover:text-purple-400 transition-colors">
          Início
        </Link>
        <Link href="/sobre" className="hover:text-purple-400 transition-colors">
          Sobre
        </Link>
        <Link href="/projetos" className="hover:text-purple-400 transition-colors">
          Projetos
        </Link>
        <Link href="/blog" className="hover:text-purple-400 transition-colors">
          Blog
        </Link>
      </nav>
      {/* Botão para alternar o tema */}
      <button
        onClick={toggleTheme}
        className="px-4 py-2 border rounded transition-colors hover:bg-gray-700"
      >
        {theme === "default" ? "Mudar para Branco" : "Tema Gradiente"}
      </button>
    </header>
  );
}
