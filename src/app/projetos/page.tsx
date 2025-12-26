import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    title: "VeriDados",
    description:
      "Aplicacao web para verificar, auditar e comparar conjuntos de dados de diversas fontes. Facilita a identificacao de inconsistencias, analise exploratoria e comparacao entre diferentes versoes de dados. Util para validacao pos-ETL.",
    image: "/images/projeto-veridados.jpg",
    tags: ["Python", "Streamlit", "Pandas", "Auditoria"],
    githubUrl: "https://github.com/BrunnoML/VeriDados",
  },
  {
    title: "ApT - Audio para Texto",
    description:
      "Aplicacao que usa a biblioteca Whisper para transcrever arquivos de audio para texto. Facilita a localizacao de arquivos relevantes por pesquisa textual. Idealizada como projeto de extensao na Faculdade Estacio.",
    image: "/images/projeto1.jpg",
    tags: ["Python", "Whisper", "IA", "Transcricao"],
    githubUrl: "https://github.com/BrunnoML/ApT",
  },
  {
    title: "DistilBERT Classifier",
    description:
      "Pipeline para classificar textos usando DistilBERT para gerar embeddings, seguido de um classificador supervisionado. Inclui interface grafica com Gradio para importacao, treinamento e inferencia.",
    image: "/images/projeto2.jpg",
    tags: ["Python", "DistilBERT", "NLP", "Machine Learning"],
    githubUrl: "https://github.com/BrunnoML/distilbert-classifier",
  },
];

export default function Projetos() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-0">
            Meus Projetos
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Projetos focados em Python, Analise de Dados e Inteligencia
            Artificial aplicados a resolucao de problemas reais.
          </p>
        </div>

        {/* GitHub CTA */}
        <div className="card mb-12 text-center bg-gradient-to-r from-dark-800 to-dark-900">
          <p className="text-lg text-text-secondary mb-4">
            Explore todos os meus projetos no GitHub
          </p>
          <a
            href="https://github.com/BrunnoML"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Visitar GitHub
          </a>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>

        {/* Competencias Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Tecnologias Utilizadas
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Python",
              "Whisper",
              "DistilBERT",
              "Hugging Face",
              "Gradio",
              "Pandas",
              "Scikit-learn",
              "PyTorch",
              "NLP",
              "Machine Learning",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-dark-800 border border-dark-700 text-text-secondary hover:border-purple-500/50 hover:text-purple-400 transition-all"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
