import { getPosts } from '@/lib/notion';
import Link from 'next/link';

export const revalidate = 60; // Revalida a cada 60 segundos

// Função para formatar a data no formato dia-mês-ano
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0'); // Garante 2 dígitos (ex.: 03)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0, então somamos 1
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Ex.: 24-03-2025
}

export default async function Blog() {
  const posts = await getPosts();

  return (
    <div className="p-8">
      <h1>Blog</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`} className="block hover:bg-gray-100 dark:hover:bg-gray-800 p-4 rounded-lg transition">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{post.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{formatDate(post.date)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}