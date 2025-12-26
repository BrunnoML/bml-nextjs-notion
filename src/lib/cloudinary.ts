import { v2 as cloudinary } from 'cloudinary';

// Configuracao do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Gera um ID publico estavel a partir da URL da imagem do Notion
 * Isso permite identificar imagens ja existentes no Cloudinary
 */
export function generatePublicId(notionUrl: string): string {
  // Extrai o ID do arquivo da URL S3 do Notion
  const match = notionUrl.match(/\/([a-f0-9-]{36})\.[a-z]+/i);
  if (match) {
    return match[1];
  }
  // Fallback: cria hash da URL
  return Buffer.from(notionUrl).toString('base64').slice(0, 32).replace(/[/+=]/g, '_');
}

/**
 * Verifica se uma imagem ja existe no Cloudinary
 */
export async function checkImageExists(publicId: string): Promise<string | null> {
  try {
    const result = await cloudinary.api.resource(`notion-blog/${publicId}`);
    return result.secure_url;
  } catch {
    return null;
  }
}

/**
 * Faz upload de uma imagem para o Cloudinary a partir de uma URL
 */
export async function uploadToCloudinary(
  imageUrl: string,
  publicId: string
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      folder: 'notion-blog',
      overwrite: false,
      resource_type: 'image',
      // Otimizacoes automaticas
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    // Em caso de erro, tenta retornar a URL existente
    const existing = await checkImageExists(publicId);
    if (existing) {
      return existing;
    }
    throw error;
  }
}

/**
 * Processa uma URL de imagem do Notion:
 * - Se ja existe no Cloudinary, retorna a URL do Cloudinary
 * - Se nao existe, faz upload e retorna a nova URL
 */
export async function processNotionImage(notionUrl: string): Promise<string> {
  const publicId = generatePublicId(notionUrl);

  // Verifica se ja existe
  const existingUrl = await checkImageExists(publicId);
  if (existingUrl) {
    return existingUrl;
  }

  // Faz upload
  return uploadToCloudinary(notionUrl, publicId);
}

export default cloudinary;
