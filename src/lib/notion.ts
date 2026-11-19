import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  DatabaseObjectResponse,
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';



// Inicializamos o cliente do Notion
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Tipos personalizados para as propriedades do Notion
interface NotionTitleProperty {
  type: 'title';
  title: Array<{ plain_text: string }>;
}

interface NotionRichTextProperty {
  type: 'rich_text';
  rich_text: Array<{ plain_text: string }>;
}

interface NotionDateProperty {
  type: 'date';
  date: { start: string } | null;
}

interface NotionMultiSelectProperty {
  type: 'multi_select';
  multi_select: Array<{ name: string }>;
}

// Tipo para as propriedades do Notion
interface NotionProperties {
  title: NotionTitleProperty;
  slug: NotionRichTextProperty;
  date: NotionDateProperty;
  tag: NotionMultiSelectProperty;
  published: { type: 'checkbox'; checkbox: boolean };
}

// Função para verificar se um objeto é um PageObjectResponse
const isPageObjectResponse = (
  obj: PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse
): obj is PageObjectResponse => {
  return 'properties' in obj;
};

// Função para buscar todos os blocos de uma página, lidando com paginação
async function fetchAllBlocks(blockId: string): Promise<(BlockObjectResponse | PartialBlockObjectResponse)[]> {
  let allBlocks: (BlockObjectResponse | PartialBlockObjectResponse)[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    const blocksResponse = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
    });

    allBlocks = [...allBlocks, ...blocksResponse.results];
    hasMore = blocksResponse.has_more;
    startCursor = blocksResponse.next_cursor ?? undefined;
  }

  return allBlocks;
}

const publishedFilter = {
  property: 'published',
  checkbox: { equals: true },
};

function isPublishedPage(result: Parameters<typeof isPageObjectResponse>[0]): result is PageObjectResponse {
  if (!isPageObjectResponse(result)) return false;

  const status = result.properties.published;
  return status?.type === 'checkbox' && status.checkbox;
}

// Função para buscar todos os posts do Notion
export async function getPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not defined in the environment variables.');
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: publishedFilter,
    sorts: [
      {
        property: 'date',
        direction: 'descending',
      },
    ],
  });

  // Filtramos apenas os objetos que são PageObjectResponse
  const posts = response.results
    .filter(isPublishedPage)
    .map((post) => {
      const properties = post.properties as unknown as NotionProperties;
      const mappedPost = {
        id: post.id,
        title: properties.title?.title?.[0]?.plain_text || '',
        slug: properties.slug?.rich_text?.[0]?.plain_text || '',
        date: properties.date?.date?.start || '',
        tags: properties.tag?.multi_select?.map((tag) => tag.name) || [],
      };
      return mappedPost;
    });

  return posts;
}

async function getPublishedPageBySlug(slug: string) {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not defined in the environment variables.');
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        publishedFilter,
        { property: 'slug', rich_text: { equals: slug } },
      ],
    },
    page_size: 2,
  });

  const matches = response.results.filter(isPublishedPage);
  return matches.length === 1 && !response.has_more ? matches[0] : null;
}

export async function getPublishedPostImage(slug: string, blockId: string) {
  const post = await getPublishedPageBySlug(slug);
  if (!post) return null;

  try {
    const block = await notion.blocks.retrieve({ block_id: blockId });
    if (
      !('type' in block) ||
      block.archived ||
      block.parent.type !== 'page_id' ||
      block.parent.page_id !== post.id ||
      block.type !== 'image' ||
      block.image.type !== 'file'
    ) {
      return null;
    }

    return block.image.file.url;
  } catch (error) {
    if ((error as { code?: string }).code === 'object_not_found') return null;
    throw error;
  }
}

export async function getPostBySlug(slug: string) {
  const post = await getPublishedPageBySlug(slug);
  if (!post) return null;

  const blocks = await fetchAllBlocks(post.id);
  const properties = post.properties as unknown as NotionProperties;

  return {
    id: post.id,
    title: properties.title?.title?.[0]?.plain_text || '',
    slug: properties.slug?.rich_text?.[0]?.plain_text || '',
    date: properties.date?.date?.start || '',
    tags: properties.tag?.multi_select?.map((tag) => tag.name) || [],
    blocks,
  };
}
