import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-8">
      <Image
        src="/images/avatar.png"
        alt="Brunno ML"
        width={200}
        height={200}
        className="rounded-full"
      />
      <h1 className="text-5xl font-bold text-purple-500">Brunno ML</h1>
      <p className="text-2xl">Desenvolvedor Full Stack</p>
      <h2 className="text-3xl font-semibold">Bem-vindo ao meu Portfólio</h2>
      <p className="text-xl">
        Explore as seções: Sobre, Projetos e Blog.
      </p>
    </div>
  );
}
