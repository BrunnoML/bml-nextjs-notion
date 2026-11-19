import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPostImage } from '@/lib/notion';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']);
const BLOCK_ID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const RESPONSE_HEADERS = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; sandbox",
};

function imageError(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: RESPONSE_HEADERS });
}

function isNotionStorage(url: URL) {
  if (url.protocol !== 'https:' || url.port || url.username || url.password) return false;

  return url.hostname === 'prod-files-secure.s3.us-west-2.amazonaws.com' ||
    url.hostname === 'secure.notion-static.com' ||
    (url.hostname === 's3.us-west-2.amazonaws.com' && url.pathname.startsWith('/prod-files-secure/'));
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const slug = params.get('slug');
  const blockId = params.get('block');

  if (params.has('url') || !slug || slug.length > 200 || !blockId || !BLOCK_ID.test(blockId)) {
    return imageError(400, 'Identificação da imagem inválida.');
  }

  try {
    const image = await getPublishedPostImage(slug, blockId);
    if (!image) return imageError(404, 'Imagem não encontrada.');

    const url = new URL(image);
    if (!isNotionStorage(url)) return imageError(502, 'Origem de imagem não suportada.');

    const upstream = await fetch(url, {
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(8_000),
    });
    const contentType = upstream.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
    if (!upstream.ok || !upstream.body || !contentType || !IMAGE_TYPES.has(contentType) ||
        Number(upstream.headers.get('content-length')) > MAX_IMAGE_BYTES) {
      await upstream.body?.cancel();
      return imageError(502, 'Imagem indisponível ou inválida.');
    }

    const reader = upstream.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      size += value.byteLength;
      if (size > MAX_IMAGE_BYTES) {
        await reader.cancel();
        return imageError(502, 'Imagem acima do tamanho permitido.');
      }
      chunks.push(value);
    }

    const body = new ArrayBuffer(size);
    const bytes = new Uint8Array(body);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    return new NextResponse(body, {
      headers: { ...RESPONSE_HEADERS, 'Content-Type': contentType },
    });
  } catch {
    return imageError(502, 'Imagem temporariamente indisponível.');
  }
}
