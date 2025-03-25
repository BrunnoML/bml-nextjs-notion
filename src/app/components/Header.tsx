"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // Obter o caminho atual

  // Fechar menu quando a rota muda
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Evitar renderização até que o componente esteja montado
  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center justify-between p-4 shadow-md">
      {/* Logo + Título */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-purple-500 mr-4 hover:text-purple-600 transition-colors">
        BrunnoML
        </Link>
      </div>

      {/* Botão Hamburguer (só aparece em telas pequenas) */}
      <button
        onClick={toggleMenu}
        className="md:hidden focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-800 dark:text-gray-200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {menuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Menu de Navegação */}
      <nav
        className={`absolute md:static top-full left-0 w-full md:w-auto bg-gray-200 dark:bg-gray-800 md:bg-transparent transition-all duration-300 ${
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

      {/* Botão de tema */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex items-center p-2 border rounded border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        aria-label={theme === 'dark' ? "Mudar para tema claro" : "Mudar para tema escuro"}
        title={theme === 'dark' ? "Mudar para tema claro" : "Mudar para tema escuro"}
      >
        {theme === 'dark' ? (
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