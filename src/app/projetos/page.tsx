import Image from "next/image";

export default function Projetos() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-4">Projetos</h2>
      <p className="text-xl text-center max-w-2xl mb-8">
        Meus projetos podem ser acessados diretamente no meu GitHub.
      </p>

      {/* Imagem do GitHub */}
      <Image
        src="/images/projetosGitHub.jpg"
        alt="Projetos no GitHub"
        width={800}
        height={400}
        className="rounded shadow"
      />

      <div className="mt-8">
        <a
          href="https://github.com/BrunnoML"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
        >
          Visitar GitHub
        </a>
      </div>
    </div>
  );
}