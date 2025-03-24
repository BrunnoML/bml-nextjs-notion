import { getPosts } from '@/lib/notion';
import Link from 'next/link';

export const revalidate = 1; // Revalida a cada 1 segundo

export default async function Blog() {
  const posts = await getPosts();

  return (
    <div className="p-8">
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`}>
              {post.title} - {post.date}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}