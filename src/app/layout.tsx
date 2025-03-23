import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import ThemeWrapper from "./components/ThemeWrapper";
import Footer from "./components/Footer"; // Importamos o Footer

export const metadata: Metadata = {
  title: "BrunnoML",
  description: "Site pessoal do desenvolvedor Brunno Monteiro Lira",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.add('dark');
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen flex flex-col">
        <ThemeWrapper>
          <Header />
          {/* Conteúdo principal */}
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeWrapper>
      </body>
    </html>
  );
}