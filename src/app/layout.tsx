
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
    <html lang="pt">
      <body className="bg-gray-900 text-white">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
