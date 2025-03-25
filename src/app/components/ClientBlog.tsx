"use client";

import Link from 'next/link';
import { useState } from 'react';

// Definir a interface para os posts
interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
}

interface ClientBlogProps {
  initialPosts: Post[];
}

// Função para formatar a data no formato dia-mês-ano
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function ClientBlog({ initialPosts }: ClientBlogProps) {
  const [posts] = useState<Post[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // Número de posts por página

  // Normalizar o texto para busca (remover espaços extras e acentos)
  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove acentos

  // Filtrar os posts com base no termo de busca
  const filteredPosts = posts.filter((post) =>
    normalizeText(post.title).includes(normalizeText(searchTerm))
  );

  // Calcular os posts a serem exibidos na página atual
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Calcular o número total de páginas
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Funções para navegar entre as páginas
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Blog</h1>

      {/* Campo de busca */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar posts por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <ul className="space-y-4">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="block hover:bg-gray-100 dark:hover:bg-gray-800 p-4 rounded-lg transition">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{post.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{formatDate(post.date)}</p>
              </Link>
            </li>
          ))
        ) : (
          <li className="text-gray-600 dark:text-gray-400">Nenhum post encontrado.</li>
        )}
      </ul>

      {/* Controles de paginação */}
      {filteredPosts.length > postsPerPage && (
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-white ${
              currentPage === 1
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600'
            }`}
          >
            Anterior
          </button>
          <span className="text-gray-600 dark:text-gray-400">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-white ${
              currentPage === totalPages
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600'
            }`}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}