import { getPosts } from '@/lib/notion';
import ClientBlog from '../components/ClientBlog';

// Definir a interface para os posts
interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
}

export const dynamic = 'force-dynamic';

export default async function Blog() {
  let posts: Post[] = [];
  try {
    posts = await getPosts();
  } catch (error) {
    console.error("Erro ao buscar os posts:", error);
    return (
      <div className="p-8">
        <h1>Blog</h1>
        <p className="text-red-500 dark:text-red-400">
          Falha ao carregar os posts. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return <ClientBlog initialPosts={posts} />;
}