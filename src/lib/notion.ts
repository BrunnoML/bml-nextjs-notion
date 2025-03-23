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
  Published: { type: 'checkbox'; checkbox: boolean };
}

// Função para verificar se um objeto é um PageObjectResponse
const isPageObjectResponse = (
  obj: PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse
): obj is PageObjectResponse => {
  return 'properties' in obj;
};

// Função para buscar todos os posts do Notion
export async function getPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not defined in the environment variables.');
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'published',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: 'date',
        direction: 'descending',
      },
    ],
  });

  // Filtramos apenas os objetos que são PageObjectResponse
  const posts = response.results
    .filter(isPageObjectResponse)
    .map((post) => {
      const properties = post.properties as unknown as NotionProperties;
      return {
        id: post.id,
        title: properties.title?.title?.[0]?.plain_text || '',
        slug: properties.slug?.rich_text?.[0]?.plain_text || '',
        date: properties.date?.date?.start || '',
        tags: properties.tag?.multi_select?.map((tag) => tag.name) || [],
      };
    });

  return posts;
}

// Função para buscar um post específico pelo slug
export async function getPostBySlug(slug: string) {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not defined in the environment variables.');
  }

  // Buscamos o post com o slug correspondente
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  // Filtramos apenas os objetos que são PageObjectResponse
  const post = response.results.find(isPageObjectResponse);
  if (!post) {
    return null;
  }

  // Buscamos os blocos filhos do post
  const blocksResponse = await notion.blocks.children.list({
    block_id: post.id,
  });

  const properties = post.properties as unknown as NotionProperties;

  return {
    id: post.id,
    title: properties.title?.title?.[0]?.plain_text || '',
    slug: properties.slug?.rich_text?.[0]?.plain_text || '',
    date: properties.date?.date?.start || '',
    tags: properties.tag?.multi_select?.map((tag) => tag.name) || [],
    blocks: blocksResponse.results as (BlockObjectResponse | PartialBlockObjectResponse)[],
  };
}