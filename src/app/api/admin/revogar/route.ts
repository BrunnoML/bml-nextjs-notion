import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { licenca_id } = await request.json();
  if (!licenca_id) {
    return NextResponse.json({ error: "licenca_id é obrigatório." }, { status: 400 });
  }

  await pool.execute(
    `UPDATE licencas SET revogada = 1 WHERE id = ?`,
    [licenca_id]
  );

  return NextResponse.json({ success: true });
}
