import { Client } from '@notionhq/client';

// Inicializa o cliente oficial do Notion
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID || '';
  console.log('Database ID:', databaseId);

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'published',
        checkbox: { equals: true },
      },
    });

    const posts = response.results.map((post) => ({
      id: post.id,
      title: post.properties.title?.title[0]?.plain_text || '',
      slug: post.properties.slug?.rich_text[0]?.plain_text || '',
      date: post.properties.date?.date?.start || '',
      tags: post.properties.tag?.multi_select?.map((tag) => tag.name) || [],
    }));

    console.log('Posts encontrados:', posts);
    return posts;
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  const databaseId = process.env.NOTION_DATABASE_ID || '';
  console.log('Buscando post com slug:', slug);

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'slug',
        rich_text: { equals: slug },
      },
    });

    const post = response.results[0];
    if (!post) {
      console.log('Nenhum post encontrado com o slug:', slug);
      return null;
    }

    console.log('Post encontrado:', {
      id: post.id,
      title: post.properties.title?.title[0]?.plain_text || '',
      slug: post.properties.slug?.rich_text[0]?.plain_text || '',
    });

    const pageId = post.id;
    console.log('Buscando blocos da página com ID:', pageId);

    // Busca os blocos da página usando o cliente oficial
    const blocksResponse = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100, // Ajuste conforme necessário
    });

    const blocks = blocksResponse.results;
    console.log('Blocos encontrados:', blocks);

    return {
      id: post.id,
      title: post.properties.title?.title[0]?.plain_text || '',
      slug: post.properties.slug?.rich_text[0]?.plain_text || '',
      date: post.properties.date?.date?.start || '',
      tags: post.properties.tag?.multi_select?.map((tag) => tag.name) || [],
      blocks, // Retorna os blocos em vez do recordMap
    };
  } catch (error) {
    console.error('Erro ao buscar post por slug:', error);
    return null;
  }
}