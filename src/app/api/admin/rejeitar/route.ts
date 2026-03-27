import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { pedido_id } = await request.json();
  if (!pedido_id) {
    return NextResponse.json({ error: "pedido_id é obrigatório." }, { status: 400 });
  }

  await pool.execute(
    `UPDATE pedidos SET status = 'rejeitado' WHERE id = ? AND status = 'pendente'`,
    [pedido_id]
  );

  return NextResponse.json({ success: true });
}
