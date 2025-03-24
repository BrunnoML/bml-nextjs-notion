// @ts-nocheck
import { getPostBySlug, getPosts } from "@/lib/notion";
import NotionPost from "@/app/components/NotionPost";
import { notFound } from "next/navigation";
import { BlockObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Block } from "@/app/components/NotionPost";

// Função para transformar os blocos do Notion no tipo Block esperado pelo NotionPost
function transformNotionBlocks(blocks: (PartialBlockObjectResponse | BlockObjectResponse)[]): Block[] {
  return blocks
    .filter((block): block is BlockObjectResponse => "type" in block) // Filtramos apenas BlockObjectResponse
    .map((block) => {
      // Retornamos o bloco no formato esperado pela interface Block
      return block as Block;
    });
}

// Define o intervalo de revalidação (em segundos)
export const revalidate = 1; // Revalida a cada 1 segundo

// Gera as rotas estáticas para todos os slugs
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const data = await getPostBySlug(slug);
  if (!data) {
    notFound();
  }

  // Transformamos os blocos para o tipo Block
  const transformedBlocks = transformNotionBlocks(data.blocks);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{data.date}</p>
        <NotionPost blocks={transformedBlocks} />
      </div>
    </div>
  );
}