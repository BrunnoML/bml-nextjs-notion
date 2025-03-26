"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

// Definimos tipos compatíveis com os dados do Notion
export interface RichText {
  plain_text: string;
  href?: string;
  annotations: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    color: string;
    code: boolean;
  };
}

export interface Block {
  type: string;
  id: string;
  paragraph?: {
    rich_text: RichText[];
    color?: string;
  };
  heading_1?: {
    rich_text: RichText[];
  };
  heading_2?: {
    rich_text: RichText[];
  };
  heading_3?: {
    rich_text: RichText[];
  };
  bulleted_list_item?: {
    rich_text: RichText[];
  };
  numbered_list_item?: {
    rich_text: RichText[];
  };
  image?: {
    file?: { url: string };
    external?: { url: string };
    caption?: RichText[];
  };
  embed?: {
    url: string;
    caption?: RichText[];
  };
  divider?: Record<string, never>;
  code?: {
    rich_text: RichText[];
    language: string;
  };
}

interface NotionPostProps {
  blocks: Block[];
}

export default function NotionPost({ blocks }: NotionPostProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [imageStates, setImageStates] = useState<Record<string, { isLoading: boolean, hasError: boolean }>>({});

  // Função para atualizar o estado de uma imagem específica
  const setImageState = (id: string, state: { isLoading?: boolean, hasError?: boolean }) => {
    setImageStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...state
      }
    }));
  };

  // Adicione esta interface no seu arquivo de tipos
interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

  // Função loader com tipagem correta
  const customLoader = ({ src, width, quality = 75 }: ImageLoaderProps): string => {
    if (src.includes('amazonaws.com')) {
      return `${src}?width=${width}&quality=${quality}`;
    }
    return `https://images.weserv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }).catch(err => {
        console.error('Falha ao copiar texto: ', err);
        fallbackCopyToClipboard(text, id);
      });
    } else {
      fallbackCopyToClipboard(text, id);
    }
  };

  const fallbackCopyToClipboard = (text: string, id: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "red": return "text-red-500";
      case "blue": return "text-blue-500";
      case "green": return "text-green-500";
      case "yellow": return "text-yellow-500";
      case "purple": return "text-purple-500";
      case "orange": return "text-orange-500";
      case "pink": return "text-pink-500";
      case "brown": return "text-amber-700";
      case "gray": return "text-gray-500";
      default: return "";
    }
  };

  const getBackgroundColorClass = (backgroundColor?: string) => {
    switch (backgroundColor) {
      case "gray_background": return "bg-gray-200 dark:bg-gray-700";
      case "brown_background": return "bg-amber-200 dark:bg-amber-700";
      case "orange_background": return "bg-orange-200 dark:bg-orange-700";
      case "yellow_background": return "bg-yellow-500 dark:bg-yellow-600";
      case "green_background": return "bg-green-200 dark:bg-green-700";
      case "blue_background": return "bg-blue-200 dark:bg-blue-700";
      case "purple_background": return "bg-purple-200 dark:bg-purple-700";
      case "pink_background": return "bg-pink-200 dark:bg-pink-700";
      case "red_background": return "bg-red-200 dark:bg-red-700";
      default: return "";
    }
  };

  const renderRichText = (richText: RichText[]) => {
    return richText.map((text: RichText, index: number) => {
      const { plain_text, href, annotations } = text;
      let className = `${getColorClass(annotations.color)} px-1 rounded`;

      if (annotations.code) {
        className += " notion-code-inline px-1 rounded";
      }

      let element = (
        <span key={index} className={className}>
          {plain_text}
        </span>
      );

      if (annotations.bold) element = <strong key={index}>{element}</strong>;
      if (annotations.italic) element = <em key={index}>{element}</em>;
      if (annotations.underline) element = <u key={index}>{element}</u>;

      if (href) {
        element = (
          <a
            key={index}
            href={href}
            className={`text-purple-400 hover:underline ${getColorClass(annotations.color)} px-1 rounded ${
              annotations.code ? "notion-code-inline" : ""
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {plain_text}
          </a>
        );
      }

      return element;
    });
  };

  

  const renderBlock = (block: Block) => {
    const { type, id } = block;

    switch (type) {
      case "paragraph":
        const blockBackgroundClass = getBackgroundColorClass(block.paragraph?.color);
        if (!block.paragraph?.rich_text) {
          return <p key={id} className={`${blockBackgroundClass} px-1 rounded`}><br /></p>;
        }
        return (
          <p key={id} className={`${blockBackgroundClass} px-1 rounded`}>
            {renderRichText(block.paragraph.rich_text)}
          </p>
        );

      case "heading_1":
        if (!block.heading_2?.rich_text) return <h2 key={id} />;
        return <h2 key={id}>{renderRichText(block.heading_2.rich_text)}</h2>;

      case "heading_2":
        if (!block.heading_2?.rich_text) return <h2 key={id} />;
        return <h2 key={id}>{renderRichText(block.heading_2.rich_text)}</h2>;

      case "heading_3":
        if (!block.heading_3?.rich_text) return <h3 key={id} />;
        return <h3 key={id}>{renderRichText(block.heading_3.rich_text)}</h3>;

      case "bulleted_list_item":
        if (!block.bulleted_list_item?.rich_text) return <li key={id} className="ml-4 list-disc" />;
        return (
          <li key={id} className="ml-4 list-disc">
            {renderRichText(block.bulleted_list_item.rich_text)}
          </li>
        );
      case "numbered_list_item":
        if (!block.numbered_list_item?.rich_text) return <li key={id} className="ml-4 list-decimal" />;
        return (
          <li key={id} className="ml-4 list-decimal">
            {renderRichText(block.numbered_list_item.rich_text)}
          </li>
        );

        case "image":
  const imageUrl = block.image?.file?.url || block.image?.external?.url;
  if (!imageUrl) return <div key={id}>[Imagem não encontrada]</div>;

  const { isLoading = true, hasError = false } = imageStates[id] || {};

  return (
    <div key={id} className="my-6 mx-auto max-w-full md:max-w-2xl">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <span className="text-red-500 dark:text-red-300 text-sm">
              Falha ao carregar imagem
            </span>
          </div>
        )}

        {!hasError && (
          <Image
            src={imageUrl}
            alt={block.image?.caption?.[0]?.plain_text || "Imagem do Notion"}
            fill
            className={`object-contain rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            onLoadingComplete={() => setImageState(id, { isLoading: false })}
            onError={() => setImageState(id, { isLoading: false, hasError: true })}
            priority={false}
            unoptimized={true} // Desativa otimização para imagens do Notion
          />
        )}
      </div>

      {block.image?.caption?.[0]?.plain_text && (
        <p className={`text-center text-sm mt-2 ${hasError ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {block.image.caption[0].plain_text}
        </p>
      )}
    </div>
  );

      case "embed":
        const embedUrl = block.embed?.url;
        if (embedUrl && /\.(png|jpg|jpeg|gif|webp)$/i.test(embedUrl)) {
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(embedUrl)}`;
          return (
            <Image
              key={id}
              src={proxyUrl}
              alt={block.embed?.caption?.[0]?.plain_text || "Imagem incorporada"}
              width={800}
              height={600}
              className="my-4 max-w-full rounded-lg"
            />
          );
        }
        return <div key={id}>[Embed não suportado: {embedUrl}]</div>;

      case "divider":
        return <hr key={id} className="my-4 border-t border-gray-600 dark:border-gray-400" />;

      case "code":
        const codeContent = block.code?.rich_text
          ?.map(text => text.plain_text.replace(/\r\n/g, '\n').replace(/\r/g, '\n'))
          .join('') || '';
        const language = block.code?.language || 'plaintext';
        const currentTheme = resolvedTheme || theme || 'light';

        const customCoyTheme = {
          ...coy,
          'code[class*="language-"]': {
            ...coy['code[class*="language-"]'],
            background: "#f5f5f7",
            color: "#333",
          },
          '.keyword': { color: "#d73a49", fontWeight: "bold" },
          '.string': { color: "#032f62" },
          '.comment': { color: "#6a737d", fontStyle: "italic" },
          '.number': { color: "#005cc5" },
          '.function': { color: "#6f42c1" },
        };

        const customDarkTheme = {
          ...vscDarkPlus,
          'code[class*="language-"]': {
            ...vscDarkPlus['code[class*="language-"]'],
            background: "#1e1e1e",
          },
          '.keyword': { color: "#569cd6", fontWeight: "bold" },
          '.string': { color: "#ce9178" },
          '.comment': { color: "#6a9955", fontStyle: "italic" },
        };

        return (
          <div key={`${id}-container`} className="my-4 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
            <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 px-4 py-2">
              <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                {language}
              </span>
              <button 
                onClick={() => copyToClipboard(codeContent, id)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                title="Copiar código"
                disabled={copiedId === id}
              >
                {copiedId === id ? 'Copiado!' : (
                  <>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copiar
                  </>
                )}
              </button>
            </div>
            <SyntaxHighlighter
              key={`${id}-${currentTheme}`}
              language={language.toLowerCase()}
              style={currentTheme === 'dark' ? customDarkTheme : customCoyTheme}
              customStyle={{
                padding: '1rem',
                fontSize: '14px',
                margin: 0,
                width: '100%',
                textAlign: 'left',
                backgroundColor: currentTheme === 'dark' ? '#1e1e1e' : '#f5f5f7',
              }}
              showLineNumbers
              wrapLines
              lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
            >
              {codeContent}
            </SyntaxHighlighter>
          </div>
        );

      default:
        return <div key={id}>[Bloco não suportado: {type}]</div>;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
}