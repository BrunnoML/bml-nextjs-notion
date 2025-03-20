
import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "BrunnoML",
  description: "Site pessoal do desenvolvedor Brunno Monteiro Lira",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // O layout é um HTML com fundo escuro e texto branco
    // O conteúdo é renderizado dentro da tag <main>
    // O componente Header é renderizado acima do conteúdo
    // O componente Header é importado de src/app/components/Header.tsx
    // O componente Header é um cabeçalho com título, menu de navegação e botão de tema
    // O componente Header é um cabeçalho fixo no topo da página
    // O componente Header tem um título em roxo e links de navegação
    // O componente Header tem links para as páginas Início, Sobre, Projetos e Blog
    // O componente Header tem links que mudam de cor ao passar o mouse
    // O componente Header tem um botão que muda o tema de escuro para claro
      <html lang="pt">
        {/* A classe "bg-gray-900 text-white" garante fundo escuro e texto branco */}
        <body className="bg-gray-900 text-white min-h-screen">
          <Header />
          <main>{children}</main>
        </body>
      </html>
  );
}
