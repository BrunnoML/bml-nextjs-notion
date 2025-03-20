import Image from "next/image";

export default function Projetos() {
  return (
    <div className="min-h-screen p-8 space-y-12">
      {/* Seção Inicial */}
      <div className="flex flex-col items-center space-y-4">
        <h1>Projetos</h1>
        <p className="max-w-2xl text-center">
          Meus projetos podem ser acessados diretamente no meu GitHub.
        </p>
        <Image
          src="/images/projetosGitHub.jpg"
          alt="Projetos no GitHub"
          width={800}
          height={400}
          className="rounded shadow"
        />
        <div>
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

      {/* Seção de Exemplos de Projetos */}
      <div className="w-full space-y-8">
        {/* Card do Projeto 1 */}
        <div className="flex flex-col md:flex-row items-center rounded shadow overflow-hidden dark:bg-gray-800 bg-gray-100">
          {/* Imagem Lateral */}
          <div className="md:w-1/3">
            <Image
              src="/images/projeto1.jpg" 
              alt="Projeto ApT"
              width={400}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>
          {/* Conteúdo */}
          <div className="md:w-2/3 p-6 space-y-4">
            <h3>Projeto 1: ApT</h3>
            <p>
              Essa aplicação usa a biblioteca Whisper para transcrever arquivos de áudio
              para texto. Surgiu de uma demanda do trabalho para transcrever uma quantidade
              grande de arquivos de áudio e facilitar a localização de arquivos relevantes
              por pesquisa no texto por palavras-chave. Também foi idealizada para uso como
              projeto de extensão na Faculdade Estácio, no curso de Sistemas de Informação,
              pensando em um ambiente gráfico que facilite a usabilidade do usuário sem
              conhecimento em tecnologia.
            </p>
          </div>
        </div>

        {/* Card do Projeto 2 */}
        <div className="flex flex-col md:flex-row items-center rounded shadow overflow-hidden dark:bg-gray-800 bg-gray-100">
          <div className="md:w-1/3">
            <Image
              src="/images/projeto2.jpg"
              alt="Projeto Distilbert Classifier"
              width={400}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="md:w-2/3 p-6 space-y-4">
            <h3>Projeto 2: Distilbert Classifier</h3>
            <p>
              Este projeto cria um pipeline para classificar textos (por exemplo, históricos
              de ocorrências policiais) usando DistilBERT para gerar embeddings, seguido de
              um classificador supervisionado (ex.: Logistic Regression). O pipeline inclui
              etapas para importar e acumular dados, realizar pré-processamento, treinar o
              modelo e fazer inferências. Além disso, há uma interface gráfica com Gradio
              que integra as funções de importação, treinamento, inferência e verificação/
              correção dos registros.
            </p>
          </div>
        </div>

        {/* Card do Projeto 3 */}
        <div className="flex flex-col md:flex-row items-center rounded shadow overflow-hidden dark:bg-gray-800 bg-gray-100">
          <div className="md:w-1/3">
            <Image
              src="/images/projeto3.jpg"
              alt="Projeto Minha Linha do Tempo"
              width={400}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="md:w-2/3 p-6 space-y-4">
            <h3>Projeto 3: Minha Linha do Tempo</h3>
            <p>
              O Minha Linha do Tempo é um local de registro da evolução das atividades
              realizadas durante o desenvolvimento das habilidades em tecnologia, sendo
              mantido online.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}