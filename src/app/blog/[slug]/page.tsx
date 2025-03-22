import { getPosts, getPostBySlug } from '@/lib/notion';
import NotionPost from '../../components/NotionPost';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPostBySlug(slug);

  if (!data) {
    return {
      title: "Post não encontrado",
      description: "Post não encontrado no blog.",
    };
  }

  return {
    title: data.title,
    description: `Leia o post "${data.title}" publicado em ${data.date}.`,
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPostBySlug(slug);

  if (!data || !data.blocks) {
    return <div className="text-center text-gray-500 dark:text-gray-400 mt-8">Post não encontrado</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{data.date}</p>
        <NotionPost blocks={data.blocks} />
      </div>
    </div>
  );
}