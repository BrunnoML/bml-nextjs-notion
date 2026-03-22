import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: "🎙️",
    title: "Transcrição com IA",
    description:
      "Modelos Whisper (base, medium, large) para transcrição precisa em português e outros idiomas.",
  },
  {
    icon: "📄",
    title: "Laudo Técnico PDF",
    description:
      "Geração de laudo técnico em formato PDF com hash SHA-256 e elementos de documentação da cadeia de custódia.",
  },
  {
    icon: "🔒",
    title: "100% Local",
    description:
      "Nenhum arquivo de áudio, transcrição ou dado pessoal é transmitido para servidores externos.",
  },
  {
    icon: "📁",
    title: "Processamento em Lote",
    description:
      "Processe múltiplos arquivos de uma vez. Selecione a pasta de entrada e saída e inicie com um clique.",
  },
  {
    icon: "🔍",
    title: "Texto Pesquisável",
    description:
      "Transcrições exportadas em .txt — localize trechos relevantes por palavra-chave sem ouvir arquivo por arquivo.",
  },
  {
    icon: "🌙",
    title: "Interface Moderna",
    description:
      "Interface gráfica com tema escuro, desenvolvida com CustomTkinter para uso fluido no desktop.",
  },
];

const techStack = [
  "Python 3.12",
  "Whisper (OpenAI)",
  "CustomTkinter",
  "ReportLab",
  "Ed25519",
  "FFmpeg",
];

export default function AptPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/produtos" className="hover:text-text-secondary transition-colors no-underline">
              Produtos
            </Link>
            <span>/</span>
            <span className="text-text-secondary">ApT</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent-success/10 border border-accent-success/30 text-accent-success">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-success" />
              Disponível
            </span>
            <span className="tech-badge">
              🔒 100% Local
            </span>
            <span className="tech-badge">
              Apache 2.0 + EULA
            </span>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/apt-icon.png"
              alt="ApT — Áudio para Texto"
              width={120}
              height={120}
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 mt-0">
            <span className="text-text-primary">Ap</span>
            <span className="bg-gradient-to-r from-accent-primary to-accent-tertiary bg-clip-text text-transparent">
              T
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-text-secondary font-medium mb-6">
            Áudio para Texto
          </p>

          {/* Description */}
          <p className="text-lg text-text-muted max-w-2xl mx-auto mb-10">
            Software de transcrição de áudio licenciado para uso local.
            Transforme horas de escuta manual em texto pesquisável em minutos —
            com geração de laudo técnico em formato PDF e documentação da cadeia de custódia.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/BrunnoML/ApT/releases/download/v1.0.0/ApT-Setup-v1.0.0.exe"
              className="btn-primary inline-flex items-center justify-center gap-2 no-underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Baixar para Windows — v1.0.0
            </a>
            <Link href="/produtos/apt/licenca" className="btn-secondary text-center no-underline">
              Adquirir Licença
            </Link>
          </div>
          <p className="text-xs text-text-muted mt-4">
            Windows 10/11 · 64-bit · 194 MB · Grátis para avaliação
          </p>
        </div>

        {/* Background glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent-tertiary/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* O problema */}
      <section className="py-16 bg-dark-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 mt-0">
            O gargalo que o ApT elimina
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2 mt-0">
                Horas de escuta manual
              </h3>
              <p className="text-text-muted text-sm">
                Áudios de horas transcritos em minutos, sem necessidade de ouvir arquivo por arquivo.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2 mt-0">
                Busca impossível no áudio
              </h3>
              <p className="text-text-muted text-sm">
                Com o texto gerado, localize trechos relevantes por palavra-chave em segundos.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2 mt-0">
                Laudos demorados
              </h3>
              <p className="text-text-muted text-sm">
                Laudo técnico em formato PDF gerado automaticamente com hash SHA-256 do material processado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 mt-0">
            Funcionalidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card card-hover">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2 mt-0">
                  {feature.title}
                </h3>
                <p className="text-text-muted text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Público-alvo */}
      <section className="py-16 bg-dark-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8 mt-0">Para quem é o ApT</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Delegados e Investigadores",
              "Advogados e Defensores Públicos",
              "Promotores e Magistrados",
              "Peritos e Analistas",
              "Estudantes e Pesquisadores",
            ].map((role) => (
              <span
                key={role}
                className="px-4 py-2 rounded-full bg-dark-800 border border-dark-600 text-text-secondary hover:border-accent-primary/50 hover:text-text-primary transition-all"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Licenciamento */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 mt-0">
            Licenciamento
          </h2>
          <p className="text-center text-text-muted mb-12">
            O ApT é um software licenciado para uso local — não há prestação de serviço ou dependência de infraestrutura externa.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Gratuita */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-accent-success" />
                <h3 className="text-xl font-bold text-text-primary mt-0 mb-0">
                  Licença Gratuita
                </h3>
              </div>
              <p className="text-text-muted text-sm mb-6">
                Para avaliação da ferramenta.
              </p>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-accent-success mt-0.5 flex-shrink-0">✓</span>
                  <span>Até <strong className="text-text-primary">30 minutos</strong> de áudio (acumulado)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-success mt-0.5 flex-shrink-0">✓</span>
                  <span>Até <strong className="text-text-primary">1 laudo</strong> técnico em PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-success mt-0.5 flex-shrink-0">✓</span>
                  <span>Uso local, sem envio de dados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-success mt-0.5 flex-shrink-0">✓</span>
                  <span>Interface completa para avaliação</span>
                </li>
              </ul>
            </div>

            {/* Mensal */}
            <div className="card border-accent-primary/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-accent-primary" />
                <h3 className="text-xl font-bold text-text-primary mt-0 mb-0">
                  Licença Mensal
                </h3>
              </div>
              <p className="text-text-muted text-sm mb-6">
                Para uso profissional por 30 dias.
              </p>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5 flex-shrink-0">✓</span>
                  <span>Transcrição <strong className="text-text-primary">ilimitada</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5 flex-shrink-0">✓</span>
                  <span>Laudos técnicos em PDF <strong className="text-text-primary">ilimitados</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5 flex-shrink-0">✓</span>
                  <span>Cadeia de custódia completa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5 flex-shrink-0">✓</span>
                  <span>Suporte ao uso da licença</span>
                </li>
              </ul>
              <Link
                href="/produtos/apt/licenca"
                className="btn-secondary w-full text-center mt-6 block no-underline"
              >
                Solicitar
              </Link>
            </div>

            {/* Anual */}
            <div className="card border-accent-primary/40 bg-gradient-to-b from-dark-800 to-dark-900">
              <div className="flex items-center gap-3 mb-1">
                <span className="w-3 h-3 rounded-full bg-accent-primary" />
                <h3 className="text-xl font-bold text-text-primary mt-0 mb-0">
                  Licença Anual
                </h3>
              </div>
              <p className="text-xs text-accent-primary font-medium mb-3">Melhor custo-benefício</p>
              <p className="text-text-muted text-sm mb-6">
                Para uso profissional por 12 meses.
              </p>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5 flex-shrink-0">✓</span>
                  <span>Transcrição <strong className="text-text-primary">ilimitada</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5 flex-shrink-0">✓</span>
                  <span>Laudos técnicos em PDF <strong className="text-text-primary">ilimitados</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5 flex-shrink-0">✓</span>
                  <span>Cadeia de custódia completa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5 flex-shrink-0">✓</span>
                  <span>Acesso a atualizações na vigência</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5 flex-shrink-0">✓</span>
                  <span>Suporte ao uso da licença</span>
                </li>
              </ul>
              <Link
                href="/produtos/apt/licenca"
                className="btn-primary w-full text-center mt-6 block no-underline"
              >
                Adquirir Licença
              </Link>
            </div>

          </div>
          <p className="text-center text-xs text-text-muted mt-6">
            Consulte o{" "}
            <a
              href="https://github.com/BrunnoML/ApT/blob/main/EULA.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              EULA
            </a>{" "}
            e os{" "}
            <a
              href="https://github.com/BrunnoML/ApT/blob/main/TERMS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Termos de Uso
            </a>{" "}
            para detalhes sobre o licenciamento.
          </p>
        </div>
      </section>

      {/* Stack */}
      <section className="py-16 bg-dark-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8 mt-0">Tecnologias</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <span key={tech} className="tech-badge">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 mt-0">
            Pronto para eliminar o gargalo?
          </h2>
          <p className="text-text-muted mb-8">
            Solicite a licença — a versão gratuita para avaliação está inclusa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/produtos/apt/licenca" className="btn-primary no-underline">
              Adquirir Licença →
            </Link>
            <a
              href="https://github.com/BrunnoML/ApT"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Ver código no GitHub
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
