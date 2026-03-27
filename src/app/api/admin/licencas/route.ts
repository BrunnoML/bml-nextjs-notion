import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const [rows] = await pool.execute(
    `SELECT id, unidade, email, plano, machine_id, dias, emissao, vencimento, revogada, valor_cobrado, observacao, criado_em
     FROM licencas ORDER BY criado_em DESC`
  );

  return NextResponse.json({ licencas: rows });
}
