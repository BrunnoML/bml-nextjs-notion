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
 *
 * URLs do Notion S3 tem o formato:
 * https://prod-files-secure.s3.../workspace-id/file-id/filename.ext
 */
export function generatePublicId(notionUrl: string): string {
  // Extrai o file-id (UUID) da URL S3 do Notion
  // Formato: /workspace-uuid/file-uuid/filename.ext
  const match = notionUrl.match(/\/([a-f0-9-]{36})\/[^\/]+\.[a-z]+/i);
  if (match) {
    return match[1];
  }

  // Fallback: usa hash SHA-like do caminho completo
  // Pega apenas a parte do path apos o dominio
  const pathMatch = notionUrl.match(/amazonaws\.com\/(.+?)(\?|$)/);
  if (pathMatch) {
    return Buffer.from(pathMatch[1]).toString('base64').slice(0, 40).replace(/[/+=]/g, '_');
  }

  // Ultimo fallback
  return Buffer.from(notionUrl).toString('base64').slice(0, 40).replace(/[/+=]/g, '_');
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
      overwrite: true, // Permite atualizar imagens existentes
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
