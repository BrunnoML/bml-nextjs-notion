# Conteúdo para Post no Notion

**Propriedades do Post:**
- title: Redesign do Site + Integração Cloudinary
- slug: redesign-cloudinary-v2
- date: 2024-12-26
- tag: Next.js, Cloudinary, Tutorial
- published: ✅

---

## Título: Redesign do Site + Integração Cloudinary para Imagens Permanentes

Neste post, documento as melhorias realizadas no meu site pessoal, incluindo um redesign visual completo e a solução definitiva para o problema de imagens que expiravam no blog.

---

## O Problema das Imagens

Quando você usa o Notion como CMS, as imagens são armazenadas no AWS S3 com URLs temporárias que **expiram após 1 hora**:

```
https://prod-files-secure.s3.amazonaws.com/.../image.png?X-Amz-Expires=3600
```

Isso significa que após algum tempo, todas as imagens do blog simplesmente paravam de carregar. Nada frustrante para quem quer manter um blog profissional.

---

## A Solução: Cloudinary como Cache

O **Cloudinary** é uma plataforma de gerenciamento de mídia que oferece:
- URLs permanentes para imagens
- Otimização automática (WebP, compressão)
- CDN global para carregamento rápido
- Plano gratuito generoso (25GB)

### Como Funciona

1. Quando uma imagem é solicitada, ela passa por um **proxy API**
2. O proxy verifica se a imagem já existe no Cloudinary
3. Se não existe, faz upload e retorna a URL permanente
4. Se existe, retorna direto do cache

---

## Implementação

### 1. Configuração do Cloudinary

Primeiro, criei uma conta no Cloudinary e obtive as credenciais:
- Cloud Name
- API Key
- API Secret

### 2. Biblioteca de Upload

Criei `src/lib/cloudinary.ts` com funções para:

```typescript
// Gera ID único a partir da URL do Notion
export function generatePublicId(notionUrl: string): string {
  // Extrai o file-id (UUID) da URL S3
  const match = notionUrl.match(/\/([a-f0-9-]{36})\/[^\/]+\.[a-z]+/i);
  if (match) {
    return match[1];
  }
  // Fallback para hash
  return Buffer.from(notionUrl).toString('base64').slice(0, 40);
}

// Faz upload para o Cloudinary
export async function uploadToCloudinary(imageUrl: string, publicId: string) {
  const result = await cloudinary.uploader.upload(imageUrl, {
    public_id: publicId,
    folder: 'notion-blog',
    overwrite: true,
  });
  return result.secure_url;
}
```

### 3. API de Proxy

Criei `/api/proxy-image` para interceptar requisições de imagens:

```typescript
export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get('url');

  // Gera ID único
  const publicId = generatePublicId(imageUrl);

  // Verifica cache
  let cloudinaryUrl = await checkImageExists(publicId);

  if (!cloudinaryUrl) {
    // Upload para Cloudinary
    cloudinaryUrl = await uploadToCloudinary(imageUrl, publicId);
  }

  // Redireciona para URL permanente
  return NextResponse.redirect(cloudinaryUrl);
}
```

### 4. Integração com NotionPost

No componente que renderiza posts, alterei para usar o proxy:

```typescript
const imageUrl = rawImageUrl.includes('amazonaws.com')
  ? `/api/proxy-image?url=${encodeURIComponent(rawImageUrl)}`
  : rawImageUrl;
```

---

## Redesign Visual

Além da integração com Cloudinary, fiz um redesign completo do site:

### Nova Paleta de Cores

- **Background**: Dark mode com tons de azul escuro (#0f1419)
- **Accent**: Roxo (#8b5cf6) para elementos interativos
- **Tech Colors**: Cores específicas para Python, Data e IA

### Bloco de Código na Home

Adicionei um bloco estilizado que representa minha filosofia:

```python
def transform(tech, data, ai):
    return "processos otimizados + decisões potencializadas"
```

### Cards de Projetos Melhorados

- Design com hover effects
- Tags coloridas por categoria
- Links diretos para o GitHub

---

## Variáveis de Ambiente

Para reproduzir, configure estas variáveis:

```env
# Notion
NOTION_TOKEN=seu_token
NOTION_DATABASE_ID=seu_database_id

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud
CLOUDINARY_API_KEY=sua_key
CLOUDINARY_API_SECRET=seu_secret
```

---

## Resultados

✅ Imagens que nunca expiram
✅ Carregamento mais rápido (CDN global)
✅ Otimização automática de formato
✅ Design moderno e consistente
✅ Documentação completa no README

---

## Próximos Passos

- Adicionar mais projetos ao portfólio
- Escrever posts técnicos sobre Python e IA
- Implementar busca no blog
- Adicionar analytics

---

## Links Úteis

- [Cloudinary - Documentação](https://cloudinary.com/documentation)
- [Notion API - Guia](https://developers.notion.com/)
- [Next.js - App Router](https://nextjs.org/docs/app)

---

*Post escrito em 26/12/2024 como parte da documentação do projeto.*
