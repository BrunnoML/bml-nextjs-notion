import { NextRequest, NextResponse } from 'next/server';
import { processNotionImage, generatePublicId, checkImageExists, uploadToCloudinary } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Verifica se as credenciais do Cloudinary estao configuradas
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      // Tenta usar Cloudinary
      const publicId = generatePublicId(imageUrl);

      // Verifica se ja existe no Cloudinary
      let cloudinaryUrl = await checkImageExists(publicId);

      if (!cloudinaryUrl) {
        // Faz upload para o Cloudinary
        cloudinaryUrl = await uploadToCloudinary(imageUrl, publicId);
      }

      // Redireciona para a URL do Cloudinary
      return NextResponse.redirect(cloudinaryUrl, {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Fallback: proxy direto da imagem (quando Cloudinary nao esta configurado)
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BlogImageProxy/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: response.status }
      );
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'image/png';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);

    // Tenta fazer proxy direto como ultimo recurso
    try {
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch {
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: 500 }
      );
    }
  }
}

// Configuracao de runtime para Edge (mais rapido para proxy de imagens)
export const runtime = 'nodejs';

// Cache por 24 horas
export const revalidate = 86400;
