import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-8">
      {/* Avatar */}
      <Image
        src="/images/avatar.jpg"
        alt="Brunno ML"
        width={120}
        height={120}
        className="rounded-full shadow"
      />

      {/* Nome e Descrição */}
      <h1 className="text-4xl font-bold text-purple-500">Brunno</h1>
      <p className="text-xl text-center max-w-xl">
        Desenvolvedor apaixonado por tecnologia e pelo impacto positivo que ela
        pode gerar na sociedade.
      </p>

      {/* Redes Sociais */}
      <div className="flex space-x-4 mt-4">
        <a
          href="https://x.com/BrunnoML"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/icon-x.png"
            alt="X"
            width={32}
            height={32}
            className="hover:opacity-80 transition-opacity"
          />
        </a>
        <a
          href="https://www.linkedin.com/in/BrunnoML"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/icon-linkedin.png"
            alt="LinkedIn"
            width={32}
            height={32}
            className="hover:opacity-80 transition-opacity"
          />
        </a>
        <a
          href="https://github.com/BrunnoML"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/icon-github.png"
            alt="GitHub"
            width={32}
            height={32}
            className="hover:opacity-80 transition-opacity"
          />
        </a>
      </div>
    </div>
  );
}
