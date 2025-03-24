import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  // Verificar a chave secreta para segurança
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Chave secreta inválida" }, { status: 401 });
  }

  try {
    // Revalidar a página /blog
    await revalidatePath("/blog");

    // Revalidar todas as páginas /blog/[slug]
    await revalidatePath("/blog/[slug]", "page");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: "Erro ao revalidar", error: err }, { status: 500 });
  }
}