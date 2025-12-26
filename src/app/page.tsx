import Image from "next/image";
import Link from "next/link";

// Componente de Link Social
function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-lg bg-dark-800 border border-dark-700 text-text-secondary hover:text-purple-400 hover:border-purple-500/50 hover:shadow-glow-purple transition-all duration-200"
      aria-label={label}
    >
      {icon}
    </a>
  );
}

// Componente de Badge Tech
function TechBadge({
  label,
  color,
}: {
  label: string;
  color: "python" | "data" | "ai";
}) {
  const colors = {
    python: "border-tech-python/50 text-tech-python bg-tech-python/10",
    data: "border-tech-data/50 text-tech-data bg-tech-data/10",
    ai: "border-tech-ai/50 text-tech-ai bg-tech-ai/10",
  };

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${colors[color]}`}
    >
      {label}
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Avatar com efeito glow */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full blur-xl opacity-30 animate-pulse-slow" />
              <Image
                src="/images/avatar.jpg"
                alt="Brunno ML"
                width={160}
                height={160}
                className="relative rounded-full border-2 border-dark-600 shadow-2xl"
                priority
              />
            </div>

            {/* Nome */}
            <h1 className="text-5xl md:text-6xl font-bold mb-4 mt-0">
              Brunno
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                ML
              </span>
            </h1>

            {/* Titulo */}
            <p className="text-xl md:text-2xl text-text-secondary mb-6">
              Desenvolvedor e Analista de Dados
            </p>

            {/* Tech Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <TechBadge label="Python" color="python" />
              <TechBadge label="Dados" color="data" />
              <TechBadge label="IA" color="ai" />
            </div>

            {/* Descrição */}
            <p className="max-w-2xl text-lg text-text-muted mb-6">
              Desenvolvendo soluções analíticas, dashboards e automações com
              Python e IA.
            </p>

            {/* Code Block */}
            <div className="w-full max-w-2xl mb-10">
              <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-dark-900 border-b border-dark-600">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-text-muted">transform.py</span>
                </div>
                <pre className="p-4 text-xs sm:text-sm md:text-base font-mono text-left">
                  <code>
                    <span className="text-purple-400">def</span>{" "}
                    <span className="text-tech-data">transform</span>
                    <span className="text-text-secondary">(</span>
                    <span className="text-orange-400">tech</span>
                    <span className="text-text-secondary">, </span>
                    <span className="text-orange-400">data</span>
                    <span className="text-text-secondary">, </span>
                    <span className="text-orange-400">ai</span>
                    <span className="text-text-secondary">):</span>
                    {"\n"}
                    {"    "}
                    <span className="text-purple-400">return</span>{" "}
                    <span className="text-tech-data">&quot;processos otimizados + decisões potencializadas&quot;</span>
                  </code>
                </pre>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mb-12">
              <SocialLink
                href="https://github.com/BrunnoML"
                label="GitHub"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                }
              />
              <SocialLink
                href="https://www.linkedin.com/in/brunnoml"
                label="LinkedIn"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                }
              />
              <SocialLink
                href="https://x.com/BrunnoML"
                label="X (Twitter)"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                }
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/projetos" className="btn-primary">
                Ver Projetos
              </Link>
              <Link href="/blog" className="btn-secondary">
                Ler Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tech-ai/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Áreas de Atuação */}
      <section className="py-16 bg-dark-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card card-hover text-center">
              <div className="text-4xl font-bold text-tech-python mb-2">
                Python
              </div>
              <div className="text-text-secondary">Linguagem Principal</div>
            </div>
            <div className="card card-hover text-center">
              <div className="text-4xl font-bold text-tech-data mb-2">
                Dashboards
              </div>
              <div className="text-text-secondary">Streamlit & Visualizações</div>
            </div>
            <div className="card card-hover text-center">
              <div className="text-4xl font-bold text-tech-ai mb-2">IA/ML</div>
              <div className="text-text-secondary">Foco de Estudo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Competencias Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Principais Competências
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Análise de Dados",
              "Python",
              "Streamlit",
              "Visualização de Dados",
              "Inteligência Artificial",
              "Machine Learning",
              "Automação de Processos",
              "SQL",
            ].map((skill) => (
              <div
                key={skill}
                className="p-4 rounded-lg bg-dark-800 border border-dark-700 text-center text-text-secondary hover:border-purple-500/50 hover:text-purple-400 transition-all"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
