import Link from "next/link";

interface ProductCardProps {
  emoji: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  status: "ativo" | "em-breve";
  href?: string;
}

function ProductCard({
  emoji,
  title,
  tagline,
  description,
  tags,
  status,
  href,
}: ProductCardProps) {
  const cardContent = (
    <div className="group card card-hover h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{emoji}</span>
        {status === "ativo" ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent-success/10 border border-accent-success/30 text-accent-success">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-success animate-pulse" />
            Disponível
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-dark-700 border border-dark-600 text-text-muted">
            Em breve
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-text-primary mb-1 mt-0">{title}</h2>
      <p className="text-sm text-accent-tertiary font-medium mb-3">{tagline}</p>

      {/* Description */}
      <p className="text-text-muted flex-1 mb-5">{description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs rounded bg-dark-700 text-text-secondary border border-dark-600"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      {status === "ativo" && href ? (
        <span className="btn-primary text-center text-sm">
          Conhecer o produto →
        </span>
      ) : (
        <span className="btn-secondary text-center text-sm cursor-default opacity-60">
          Em desenvolvimento
        </span>
      )}
    </div>
  );

  if (status === "ativo" && href) {
    return (
      <Link href={href} className="block no-underline hover:no-underline">
        {cardContent}
      </Link>
    );
  }

  return <div>{cardContent}</div>;
}

export default function Produtos() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-0">
            Produtos
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Software licenciado para uso local — desenvolvido para profissionais
            que precisam de ferramentas confiáveis e seguras.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ProductCard
            emoji="🎙️"
            title="ApT"
            tagline="Áudio para Texto"
            description="Transcrição automática de áudios com IA 100% local. Geração de laudo técnico em formato PDF com documentação da cadeia de custódia. Ideal para profissionais jurídicos, investigativos e periciais."
            tags={["Python", "Whisper", "IA", "Transcrição", "PDF"]}
            status="ativo"
            href="/produtos/apt"
          />
          <ProductCard
            emoji="🐙"
            title="OctoMask"
            tagline="Anonimização de Dados"
            description="Ferramenta para anonimização de dados sensíveis em documentos e bases de dados. Em desenvolvimento — entre em contato para mais informações."
            tags={["Python", "LGPD", "Privacidade", "Anonimização"]}
            status="em-breve"
          />
        </div>

        {/* Note */}
        <div className="mt-16 text-center">
          <p className="text-text-muted text-sm">
            Todos os produtos são executados integralmente no ambiente do usuário,{" "}
            sem dependência de infraestrutura externa.
          </p>
        </div>

      </div>
    </div>
  );
}
