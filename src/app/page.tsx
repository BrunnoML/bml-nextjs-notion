import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white space-y-4">
      <Image src="/images/avatar.png" alt="Brunno ML" width={200} height={200} />
      <h1 className="text-4xl font-bold">Brunno ML</h1>
      <p className="text-2xl font-bold">Desenvolvedor Full Stack</p>
    </div>
    
  );
}
