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
    background_color?: string;
  };
}

// Definimos a interface Block com as propriedades esperadas
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

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  const getColorClass = (color: string) => {
    switch (color) {
      case "red":
        return "text-red-500";
      case "blue":
        return "text-blue-500";
      case "green":
        return "text-green-500";
      case "yellow":
        return "text-yellow-500";
      case "purple":
        return "text-purple-500";
      case "orange":
        return "text-orange-500";
      case "pink":
        return "text-pink-500";
      case "brown":
        return "text-amber-700";
      case "gray":
        return "text-gray-500";
      default:
        return "";
    }
  };

  const getBackgroundColorClass = (backgroundColor: string | undefined) => {
    if (!backgroundColor) return "";
    switch (backgroundColor) {
      case "red_background":
        return "bg-red-100 text-black";
      case "blue_background":
        return "bg-blue-100 text-black";
      case "green_background":
        return "bg-green-100 text-black";
      case "yellow_background":
        return "bg-yellow-100 text-black";
      case "purple_background":
        return "bg-purple-100 text-black";
      case "orange_background":
        return "bg-orange-100 text-black";
      case "pink_background":
        return "bg-pink-100 text-black";
      case "brown_background":
        return "bg-amber-100 text-black";
      case "gray_background":
        return "bg-gray-100 text-black";
      default:
        return "";
    }
  };

  const renderRichText = (richText: RichText[]) => {
    return richText.map((text: RichText, index: number) => {
      const { plain_text, href, annotations } = text;
      const backgroundClass = getBackgroundColorClass(annotations.background_color);
      let element = (
        <span
          key={index}
          className={`${getColorClass(annotations.color)} ${backgroundClass} px-1 rounded inline-block`}
        >
          {plain_text}
        </span>
      );

      if (annotations.bold) {
        element = <strong key={index}>{element}</strong>;
      }
      if (annotations.italic) {
        element = <em key={index}>{element}</em>;
      }
      if (annotations.underline) {
        element = <u key={index}>{element}</u>;
      }

      if (href) {
        element = (
          <a
            key={index}
            href={href}
            className={`text-purple-400 hover:underline ${getColorClass(annotations.color)} ${backgroundClass} px-1 rounded inline-block`}
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
        const hasRichText = block.paragraph && block.paragraph.rich_text && block.paragraph.rich_text.length > 0;
        if (hasRichText) {
          const paragraph = block.paragraph as { rich_text: RichText[]; color?: string };
          return (
            <p key={id} className={`my-2 ${blockBackgroundClass} px-1 rounded`}>
              {renderRichText(paragraph.rich_text)}
            </p>
          );
        }
        return (
          <p key={id} className={`my-2 ${blockBackgroundClass} px-1 rounded`}>
            <br />
          </p>
        );
      case "heading_1":
        const hasHeading1Text = block.heading_1 && block.heading_1.rich_text && block.heading_1.rich_text.length > 0;
        if (hasHeading1Text) {
          const heading1 = block.heading_1 as { rich_text: RichText[] };
          return (
            <h1 key={id} className="text-3xl font-bold my-4">
              {renderRichText(heading1.rich_text)}
            </h1>
          );
        }
        return <h1 key={id} className="text-3xl font-bold my-4" />;
      case "heading_2":
        const hasHeading2Text = block.heading_2 && block.heading_2.rich_text && block.heading_2.rich_text.length > 0;
        if (hasHeading2Text) {
          const heading2 = block.heading_2 as { rich_text: RichText[] };
          return (
            <h2 key={id} className="text-2xl font-semibold my-3">
              {renderRichText(heading2.rich_text)}
            </h2>
          );
        }
        return <h2 key={id} className="text-2xl font-semibold my-3" />;
      case "heading_3":
        const hasHeading3Text = block.heading_3 && block.heading_3.rich_text && block.heading_3.rich_text.length > 0;
        if (hasHeading3Text) {
          const heading3 = block.heading_3 as { rich_text: RichText[] };
          return (
            <h3 key={id} className="text-xl font-medium my-2">
              {renderRichText(heading3.rich_text)}
            </h3>
          );
        }
        return <h3 key={id} className="text-xl font-medium my-2" />;
      case "bulleted_list_item":
        const hasBulletedText = block.bulleted_list_item && block.bulleted_list_item.rich_text && block.bulleted_list_item.rich_text.length > 0;
        if (hasBulletedText) {
          const bulletedListItem = block.bulleted_list_item as { rich_text: RichText[] };
          return (
            <li key={id} className="ml-4 list-disc">
              {renderRichText(bulletedListItem.rich_text)}
            </li>
          );
        }
        return <li key={id} className="ml-4 list-disc" />;
      case "numbered_list_item":
        const hasNumberedText = block.numbered_list_item && block.numbered_list_item.rich_text && block.numbered_list_item.rich_text.length > 0;
        if (hasNumberedText) {
          const numberedListItem = block.numbered_list_item as { rich_text: RichText[] };
          return (
            <li key={id} className="ml-4 list-decimal">
              {renderRichText(numberedListItem.rich_text)}
            </li>
          );
        }
        return <li key={id} className="ml-4 list-decimal" />;
      case "image":
        const imageUrl = block.image?.file?.url || block.image?.external?.url;
        if (!imageUrl) {
          return <div key={id}>[Imagem não encontrada]</div>;
        }
        return (
          <Image
            key={id}
            src={imageUrl}
            alt={block.image?.caption?.[0]?.plain_text || "Imagem do Notion"}
            width={800}
            height={600}
            className="my-4 max-w-full rounded-lg"
          />
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
        const codeContent = block.code?.rich_text?.[0]?.plain_text || '';
        const language = block.code?.language || 'plaintext';
        const currentTheme = resolvedTheme || theme || 'light';
        return (
          <div
            key={`${id}-container`}
            className="my-4 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700"
          >
            <SyntaxHighlighter
              key={`${id}-${currentTheme}`}
              language={language}
              style={currentTheme === 'dark' ? vscDarkPlus : coy}
              customStyle={{
                padding: '1rem',
                fontSize: '14px',
                background: currentTheme === 'dark' ? '#1e1e1e' : '#f5f5f5',
                margin: 0,
              }}
              showLineNumbers
              wrapLines
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
    return null; // Evitar renderização até que o componente esteja montado
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
}