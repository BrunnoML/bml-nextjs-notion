<h1 align="center">BrunnoML - Portfólio & Blog</h1>

<p align="center">
  Site pessoal com blog integrado ao Notion, cache de imagens via Cloudinary e deploy automático na Vercel.
</p>

<p align="center">
  <a href="#-visao-geral">Visão Geral</a>&nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-arquitetura">Arquitetura</a>&nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-integrações">Integrações</a>&nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-como-rodar">Como Rodar</a>&nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-deploy">Deploy</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=7c3aed&labelColor=0f1419">
  <img alt="Next.js" src="https://img.shields.io/static/v1?label=Next.js&message=14.2&color=000000&labelColor=0f1419">
  <img alt="TypeScript" src="https://img.shields.io/static/v1?label=TypeScript&message=5.x&color=3178c6&labelColor=0f1419">
</p>

<br>

<p align="center">
  <img alt="Preview do site BrunnoML" src="public/assets/preview2.png" width="100%">
</p>

---

## 📋 Visão Geral

O **BrunnoML** é um portfólio pessoal focado em **Python, Dados e IA**, com as seguintes seções:

| Página | Descrição |
|--------|-----------|
| **Home** | Apresentação com badges de tecnologias e bloco de código estilizado |
| **Sobre** | Formação, áreas de interesse e tecnologias utilizadas |
| **Projetos** | Cards com projetos do GitHub (VeriDados, ApT, DistilBERT) |
| **Blog** | Posts dinâmicos gerenciados via Notion como CMS |

### Características

- Design dark mode com paleta roxo/tech
- Responsivo (mobile-first)
- SEO otimizado (Open Graph, Twitter Cards)
- Blog com Notion como CMS
- Imagens com cache permanente via Cloudinary
- Deploy automático via GitHub → Vercel

---

## 🏗 Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIO                                  │
│                    www.brunnoml.com.br                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Next.js App                           │   │
│  │                                                          │   │
│  │  /              → Home (page.tsx)                       │   │
│  │  /sobre         → Sobre (sobre/page.tsx)                │   │
│  │  /projetos      → Projetos (projetos/page.tsx)          │   │
│  │  /blog          → Lista posts (blog/page.tsx)           │   │
│  │  /blog/[slug]   → Post individual (blog/[slug]/page.tsx)│   │
│  │  /api/proxy-image → Proxy de imagens                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│              Environment Variables                               │
│  NOTION_TOKEN, NOTION_DATABASE_ID, CLOUDINARY_*                 │
└─────────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
┌─────────────────────┐           ┌─────────────────────┐
│       NOTION        │           │     CLOUDINARY      │
│  ┌───────────────┐  │           │  ┌───────────────┐  │
│  │   Database    │  │           │  │  Media Library │  │
│  │  ───────────  │  │           │  │  ────────────  │  │
│  │  title        │  │           │  │  notion-blog/  │  │
│  │  slug         │  │           │  │    image1.png  │  │
│  │  date         │  │           │  │    image2.png  │  │
│  │  published    │  │           │  │    ...         │  │
│  │  content...   │  │           │  └───────────────┘  │
│  └───────────────┘  │           └─────────────────────┘
└─────────────────────┘
```

### Fluxo de Dados

1. **Usuário acessa o blog** → Next.js faz request para Notion API
2. **Notion retorna conteúdo** → Inclui URLs de imagens (S3, expiram em 1h)
3. **Next.js renderiza** → Imagens passam pelo `/api/proxy-image`
4. **Proxy verifica Cloudinary** → Se não existe, faz upload
5. **Cloudinary retorna URL permanente** → Imagem cacheada para sempre

---

## 🚀 Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Next.js** | 14.2.25 | Framework React com SSR/SSG |
| **React** | 18.x | Biblioteca de UI |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 3.4.x | Estilização utility-first |
| **@notionhq/client** | 2.x | SDK oficial do Notion |
| **cloudinary** | 2.x | SDK para upload de imagens |
| **next-themes** | 0.4.x | Gerenciamento de tema dark/light |

---

## 🔗 Integrações

### 1. Notion (CMS)

O Notion funciona como **headless CMS** para o blog. Cada post é uma página no database.

#### Configuração do Database

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `title` | Title | Título do post |
| `slug` | Rich Text | URL amigável (ex: "meu-post") |
| `date` | Date | Data de publicação |
| `tag` | Multi-select | Categorias/tags |
| `published` | Checkbox | Se está publicado |

#### Código de Integração

```typescript
// src/lib/notion.ts
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getPosts() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'date', direction: 'descending' }],
  });
  // ... mapeia resultados
}
```

#### Obtendo Credenciais

1. Acesse [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Crie uma nova integração → copie o **Internal Integration Token**
3. Compartilhe o database com a integração
4. Copie o **Database ID** da URL (32 caracteres após o workspace)

---

### 2. Cloudinary (Cache de Imagens)

Resolve o problema de URLs de imagens do Notion que **expiram após 1 hora**.

#### Problema

```
Notion S3 URL: https://prod-files-secure.s3.amazonaws.com/.../image.png?X-Amz-Expires=3600
                                                                        ↑ expira em 1h
```

#### Solução

```
1. Imagem solicitada → /api/proxy-image?url=<notion-s3-url>
2. Proxy extrai ID único da URL
3. Verifica se existe no Cloudinary
4. Se não: faz upload → retorna URL permanente
5. Se sim: retorna URL cacheada
```

#### Código do Proxy

```typescript
// src/app/api/proxy-image/route.ts
export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get('url');

  // Gera ID único a partir da URL do Notion
  const publicId = generatePublicId(imageUrl);

  // Verifica cache no Cloudinary
  let cloudinaryUrl = await checkImageExists(publicId);

  if (!cloudinaryUrl) {
    // Faz upload para Cloudinary
    cloudinaryUrl = await uploadToCloudinary(imageUrl, publicId);
  }

  // Redireciona para URL permanente
  return NextResponse.redirect(cloudinaryUrl);
}
```

#### Obtendo Credenciais

1. Crie conta em [cloudinary.com](https://cloudinary.com)
2. Acesse **Settings → API Keys**
3. Copie: Cloud Name, API Key, API Secret

---

### 3. Vercel (Deploy)

Deploy automático a cada push no GitHub.

#### Configuração

1. Importe o repositório no [vercel.com](https://vercel.com)
2. Configure as **Environment Variables**:

| Variável | Descrição |
|----------|-----------|
| `NOTION_TOKEN` | Token de integração do Notion |
| `NOTION_DATABASE_ID` | ID do database (32 chars) |
| `CLOUDINARY_CLOUD_NAME` | Nome do cloud |
| `CLOUDINARY_API_KEY` | Chave da API |
| `CLOUDINARY_API_SECRET` | Secret da API |

3. Deploy automático a cada `git push origin main`

---

## 💻 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Notion com integração configurada
- Conta no Cloudinary (opcional, para cache de imagens)

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/BrunnoML/bml-nextjs-notion.git
cd bml-nextjs-notion

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Inicie o servidor de desenvolvimento
npm run dev

# 5. Acesse
open http://localhost:3000
```

### Arquivo .env.local

```env
# Notion Integration
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

---

## 📁 Estrutura de Pastas

```
src/
├── app/
│   ├── api/
│   │   └── proxy-image/      # Proxy para cache de imagens
│   │       └── route.ts
│   ├── blog/
│   │   ├── [slug]/           # Página de post individual
│   │   │   └── page.tsx
│   │   └── page.tsx          # Lista de posts
│   ├── components/
│   │   ├── Header.tsx        # Navegação
│   │   ├── Footer.tsx        # Rodapé
│   │   ├── NotionPost.tsx    # Renderiza blocos do Notion
│   │   ├── ProjectCard.tsx   # Card de projeto
│   │   └── ThemeWrapper.tsx  # Provider de tema
│   ├── projetos/
│   │   └── page.tsx          # Página de projetos
│   ├── sobre/
│   │   └── page.tsx          # Página sobre
│   ├── globals.css           # Estilos globais
│   ├── layout.tsx            # Layout principal + metadata
│   └── page.tsx              # Home
├── lib/
│   ├── cloudinary.ts         # Funções de upload/cache
│   └── notion.ts             # Client e queries do Notion
public/
├── assets/
│   ├── preview.png           # Preview versão 1
│   └── preview2.png          # Preview versão 2 (atual)
├── images/                   # Imagens estáticas
└── favicon.png
```

---

## 🚀 Deploy

### Deploy Automático (Recomendado)

1. Push para `main` → Vercel detecta automaticamente
2. Build executado → Site atualizado em ~1 minuto
3. URL: https://www.brunnoml.com.br

### Deploy Manual

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel --prod
```

---

## 📝 Criando um Novo Post

1. **No Notion**: Crie uma nova página no database do blog
2. **Preencha as propriedades**:
   - `title`: Título do post
   - `slug`: url-amigavel-do-post
   - `date`: Data de publicação
   - `tag`: Categorias (ex: Next.js, Tutorial)
   - `published`: ✅ marcar para publicar
3. **Escreva o conteúdo** usando blocos do Notion
4. **Aguarde** ~1 minuto para o cache atualizar
5. **Acesse**: https://www.brunnoml.com.br/blog/seu-slug

### Blocos Suportados

- ✅ Parágrafos
- ✅ Headings (H1, H2, H3)
- ✅ Listas (bullet e numerada)
- ✅ Código com syntax highlighting
- ✅ Imagens (com cache automático)
- ✅ Citações (quote)
- ✅ Divisores
- ✅ Embeds de imagem

---

## 🎨 Customização

### Paleta de Cores

Definida em `tailwind.config.js`:

```javascript
colors: {
  dark: {
    950: '#0a0d14',  // Background principal
    900: '#0f1419',  // Cards
    // ...
  },
  purple: {
    400: '#a78bfa',  // Accent principal
    500: '#8b5cf6',
    // ...
  },
  tech: {
    python: '#3776ab',
    data: '#00d4aa',
    ai: '#7c3aed',
  }
}
```

### Adicionando Novos Projetos

Edite `src/app/projetos/page.tsx`:

```typescript
const projects = [
  {
    title: "Nome do Projeto",
    description: "Descrição...",
    image: "/images/projeto.png",
    tags: ["Python", "Streamlit"],
    githubUrl: "https://github.com/...",
  },
  // ...
];
```

---

## 🪪 Licença

Esse projeto está sob a licença MIT.

---

<p align="center">
  Feito com ☕️ por <a href="https://github.com/BrunnoML">BrunnoML</a>
</p>

<p align="center">
  <a href="https://www.brunnoml.com.br">www.brunnoml.com.br</a>
</p>
