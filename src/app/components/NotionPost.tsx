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
    code: boolean; // Suporte a estilização de código inline
  };
}

// Definimos a interface Block com as propriedades esperadas
export interface Block {
  type: string;
  id: string;
  paragraph?: {
    rich_text: RichText[];
    color?: string; // Cor de fundo ao nível do bloco (ex.: yellow_background)
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

  // Mapeia a cor do texto para uma classe Tailwind
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

  // Mapeia a cor de fundo do bloco para uma classe Tailwind
  const getBackgroundColorClass = (backgroundColor?: string) => {
    switch (backgroundColor) {
      case "gray_background":
        return "bg-gray-200 dark:bg-gray-700";
      case "brown_background":
        return "bg-amber-200 dark:bg-amber-700";
      case "orange_background":
        return "bg-orange-200 dark:bg-orange-700";
      case "yellow_background":
        return "bg-yellow-500 dark:bg-yellow-600";
      case "green_background":
        return "bg-green-200 dark:bg-green-700";
      case "blue_background":
        return "bg-blue-200 dark:bg-blue-700";
      case "purple_background":
        return "bg-purple-200 dark:bg-purple-700";
      case "pink_background":
        return "bg-pink-200 dark:bg-pink-700";
      case "red_background":
        return "bg-red-200 dark:bg-red-700";
      default:
        return "";
    }
  };

  // Renderiza texto rico (rich text) com estilizações como negrito, itálico, links, etc.
  const renderRichText = (richText: RichText[]) => {
    console.log("Rendering rich text:", richText); // Log para depuração
    return richText.map((text: RichText, index: number) => {
      const { plain_text, href, annotations } = text;
      console.log("Rich text annotations:", annotations); // Log para depuração

      // Nota: A API do Notion não suporta background_color para estilizações inline.
      // Para aplicar cores de fundo, use block.paragraph.color no Notion (nível do bloco).
      let className = `${getColorClass(annotations.color)} px-1 rounded`;

      // Estilização para texto com anotação "code"
      if (annotations.code) {
        className += " notion-code-inline px-1 rounded";
      }

      let element = (
        <span key={index} className={className}>
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

  // Renderiza cada bloco do Notion com base no tipo
const renderBlock = (block: Block) => {
  const { type, id } = block;

  switch (type) {
    case "paragraph":
      const blockBackgroundClass = getBackgroundColorClass(block.paragraph?.color);
      const hasRichText = block.paragraph && block.paragraph.rich_text && block.paragraph.rich_text.length > 0;
      if (hasRichText) {
        const paragraph = block.paragraph as { rich_text: RichText[]; color?: string };
        return (
          <p key={id} className={`${blockBackgroundClass} px-1 rounded`}>
            {renderRichText(paragraph.rich_text)}
          </p>
        );
      }
      return (
        <p key={id} className={`${blockBackgroundClass} px-1 rounded`}>
          <br />
        </p>
      );

    case "heading_1":
      const hasHeading1Text = block.heading_1 && block.heading_1.rich_text && block.heading_1.rich_text.length > 0;
      if (hasHeading1Text) {
        const heading1 = block.heading_1 as { rich_text: RichText[] };
        return (
          <h1 key={id}>
            {renderRichText(heading1.rich_text)}
          </h1>
        );
      }
      return <h1 key={id}  />;

    case "heading_2":
      const hasHeading2Text = block.heading_2 && block.heading_2.rich_text && block.heading_2.rich_text.length > 0;
      if (hasHeading2Text) {
        const heading2 = block.heading_2 as { rich_text: RichText[] };
        return (
          <h2 key={id}> 
            {renderRichText(heading2.rich_text)}
          </h2>
        );
      }
      return <h2 key={id} />;

    case "heading_3":
      const hasHeading3Text = block.heading_3 && block.heading_3.rich_text && block.heading_3.rich_text.length > 0;
      if (hasHeading3Text) {
        const heading3 = block.heading_3 as { rich_text: RichText[] };
        return (
          <h3 key={id}>
            {renderRichText(heading3.rich_text)}
          </h3>
        );
      }
      return <h3 key={id} />;

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
        console.log("Code block:", block); // Log para depuração
        const codeContent = block.code?.rich_text?.[0]?.plain_text || '';
        const language = block.code?.language || 'plaintext';
        if (!codeContent) {
          console.warn("No code content found in block:", block);
          return <div key={id} className="text-red-500">[Bloco de código vazio]</div>;
        }
        const currentTheme = resolvedTheme || theme || 'light';

        // Tema personalizado para o modo claro
        const customCoyTheme = {
          ...coy,
          'code[class*="language-"]': {
            ...coy['code[class*="language-"]'],
            background: "transparent",
          },
          '.keyword': {
            color: "red",
            background: "yellow",
          },
          '.string': {
            color: "red",
            background: "yellow",
          },
        };

        // Tema personalizado para o modo escuro
        const customDarkTheme = {
          ...vscDarkPlus,
          'code[class*="language-"]': {
            ...vscDarkPlus['code[class*="language-"]'],
            background: "transparent",
          },
          '.keyword': {
            color: "red",
            background: "yellow",
          },
          '.string': {
            color: "red",
            background: "yellow",
          },
        };

        return (
          <div
            key={`${id}-container`}
            className="my-4 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 syntax-highlighter-container"
          >
            <SyntaxHighlighter
              key={`${id}-${currentTheme}`}
              language={language.toLowerCase()}
              style={currentTheme === 'dark' ? customDarkTheme : customCoyTheme}
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