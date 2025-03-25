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

export default async function Blog() {
  let posts: Post[] = [];
  try {
    posts = await getPosts();
  } catch (error: any) {
    console.error("Erro ao buscar os posts:", error);
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Blog</h1>
        <p className="text-red-500 dark:text-red-400">
          {error.message || "Falha ao carregar os posts. Tente novamente mais tarde."}
        </p>
      </div>
    );
  }

  return <ClientBlog initialPosts={posts} />;
}