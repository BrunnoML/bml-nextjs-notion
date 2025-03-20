"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-800 text-white flex items-center justify-between p-4">
      {/* Logo + Título */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-purple-500 mr-4">Brunno ML</h1>
      </div>

      {/* Botão Hamburguer (só aparece em telas pequenas) */}
      <button
        onClick={toggleMenu}
        className="md:hidden focus:outline-none"
        aria-label="Toggle menu"
      >
        {/* Ícone hamburguer simples */}
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {menuOpen ? (
            /* Ícone de X */
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            /* Ícone de 3 linhas (hamburguer) */
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Menu de Navegação (em telas médias, aparece fixo; em telas pequenas, condicional) */}
      <nav
        className={`absolute md:static top-full left-0 w-full md:w-auto bg-gray-800 md:bg-transparent transition-all duration-300 ${
          menuOpen ? "block" : "hidden md:block"
        }`}
      >
        <ul className="md:flex md:space-x-6 p-4 md:p-0">
          <li>
            <Link
              href="/"
              className="block py-2 md:py-0 hover:text-purple-400 transition-colors"
            >
              Início
            </Link>
          </li>
          <li>
            <Link
              href="/sobre"
              className="block py-2 md:py-0 hover:text-purple-400 transition-colors"
            >
              Sobre
            </Link>
          </li>
          <li>
            <Link
              href="/projetos"
              className="block py-2 md:py-0 hover:text-purple-400 transition-colors"
            >
              Projetos
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="block py-2 md:py-0 hover:text-purple-400 transition-colors"
            >
              Blog
            </Link>
          </li>
        </ul>
      </nav>

      {/* Botão de tema (Clarear/Escurecer) - Mantendo sua lógica anterior */}
      <button
        onClick={toggleTheme}
        className="flex items-center p-2 border rounded hover:bg-gray-700 transition-colors"
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {isDark ? (
        <Image
          src="/images/icon-sun.png"
          alt="Ícone de sol"
          width={24}
          height={24}
        />
      ) : (
        <Image
          src="/images/icon-moon.png"
          alt="Ícone de lua"
          width={24}
          height={24}
        />
      )}
      </button>
    </header>
  );
}