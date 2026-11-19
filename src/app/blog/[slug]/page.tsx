import { getPostBySlug } from "@/lib/notion";
import NotionPost from "@/app/components/NotionPost";
import { notFound } from "next/navigation";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { Block, RichText } from "@/app/components/NotionPost";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function renderableText(text: RichText[]) {
  return text.map(({ plain_text, href, annotations }) => ({ plain_text, href, annotations }));
}

function transformNotionBlock(block: BlockObjectResponse): Block {
  const { id, type } = block;
  const identity = { id, type };

  switch (block.type) {
    case 'paragraph':
      return { ...identity, paragraph: { color: block.paragraph.color, rich_text: renderableText(block.paragraph.rich_text) } };
    case 'heading_1':
      return { ...identity, heading_1: { rich_text: renderableText(block.heading_1.rich_text) } };
    case 'heading_2':
      return { ...identity, heading_2: { rich_text: renderableText(block.heading_2.rich_text) } };
    case 'heading_3':
      return { ...identity, heading_3: { rich_text: renderableText(block.heading_3.rich_text) } };
    case 'bulleted_list_item':
      return { ...identity, bulleted_list_item: { rich_text: renderableText(block.bulleted_list_item.rich_text) } };
    case 'numbered_list_item':
      return { ...identity, numbered_list_item: { rich_text: renderableText(block.numbered_list_item.rich_text) } };
    case 'code':
      return { ...identity, code: { language: block.code.language, rich_text: renderableText(block.code.rich_text) } };
    case 'image': {
      const caption = renderableText(block.image.caption);
      const image = block.image.type === 'file'
        ? { hosted: true, caption }
        : { external: { url: block.image.external.url }, caption };
      return { ...identity, image };
    }
    case 'embed':
      return { ...identity, embed: { url: block.embed.url, caption: renderableText(block.embed.caption) } };
    default:
      // O componente exibe somente o tipo de blocos não suportados. Anexos
      // podem carregar URLs assinadas que devem ficar no servidor.
      return identity;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  const data = await getPostBySlug(slug);
  if (!data) {
    notFound();
  }

  const transformedBlocks = data.blocks
    .filter((block): block is BlockObjectResponse => 'type' in block)
    .map(transformNotionBlock);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{formatDate(data.date)}</p>
        <NotionPost blocks={transformedBlocks} slug={slug} />
      </div>
    </div>
  );
}
