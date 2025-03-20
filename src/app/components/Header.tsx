"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  // Exemplo de estado para alternar ícone de sol e lua
  const [isDark, setIsDark] = useState(true); // Começa em dark

  useEffect(() => {
    // Inicializa o tema de acordo com a classe já aplicada no <html>
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      // Se estava claro, agora vamos para escuro
      document.documentElement.classList.add("dark");
    } else {
      // Se estava escuro, agora vamos para claro
      document.documentElement.classList.remove("dark");
    }
  };
  

  // Define as classes do header de forma dinâmica
  // Se estiver no modo dark, fundo escuro e texto branco;
  // Se estiver no modo claro, fundo claro e texto escuro.
  const headerClasses = isDark
    ? "sticky top-0 z-50 flex items-center justify-between p-4 bg-gray-800 text-white"
    : "sticky top-0 z-50 flex items-center justify-between p-4 bg-gray-100 text-gray-800";

  return (
    <header className={`${headerClasses} shadow`}>
      <h1 className="text-2xl font-bold text-purple-500">Brunno ML</h1>
      <nav className="space-x-6">
        <Link href="/" className="hover:text-purple-400 transition-colors">
          Início
        </Link>
        <Link href="/sobre" className="hover:text-purple-400 transition-colors">
          Sobre
        </Link>
        <Link
          href="/projetos"
          className="hover:text-purple-400 transition-colors"
        >
          Projetos
        </Link>
        <Link href="/blog" className="hover:text-purple-400 transition-colors">
          Blog
        </Link>
      </nav>
      <button
        onClick={toggleTheme}
        className="flex items-center px-4 py-2 border rounded transition-colors hover:bg-gray-700"
        title="Toggle Theme"
      >
        {/* Usando os ícones que você baixou da pasta images */}
        {isDark ? (
          <Image
            src="/images/icon-sun.png"
            alt="Sol"
            width={24}
            height={24}
            className="mr-2"
          />
        ) : (
          <Image
            src="/images/icon-moon.png"
            alt="Lua"
            width={24}
            height={24}
            className="mr-2"
          />
        )}
        {isDark ? "Clarear" : "Escurecer"}
      </button>
    </header>
  );
}