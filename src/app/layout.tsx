import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import ThemeWrapper from "./components/ThemeWrapper";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "BrunnoML | Python | Dados | IA",
  description:
    "Analista de Dados especializado em Python, Dados e Inteligência Artificial. Servidor público na UNESTAC - Polícia Civil de Pernambuco.",
  keywords: [
    "Python",
    "Data Analysis",
    "AI",
    "Machine Learning",
    "Análise de Dados",
    "Inteligência Artificial",
  ],
  authors: [{ name: "Brunno Monteiro Lira" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "BrunnoML | Python | Dados | IA",
    description:
      "Analista de Dados especializado em Python, Dados e Inteligência Artificial.",
    url: "https://www.brunnoml.com.br",
    siteName: "BrunnoML",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrunnoML | Python | Dados | IA",
    description:
      "Analista de Dados especializado em Python, Dados e Inteligência Artificial.",
    creator: "@BrunnoML",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeWrapper>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeWrapper>
      </body>
    </html>
  );
}
