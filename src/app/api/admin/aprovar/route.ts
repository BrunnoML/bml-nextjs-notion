import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";
import pool from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

const PLANO_DIAS: Record<string, number> = {
  mensal: 30,
  anual: 365,
  institucional: 365,
};

const PLANO_FEATURES: Record<string, string[]> = {
  mensal: ["pdf_unlimited"],
  anual: ["pdf_unlimited"],
  institucional: ["pdf_unlimited", "logo_custom"],
};

function normalizarPlano(planoForm: string): string {
  const lower = planoForm.toLowerCase();
  if (lower.includes("mensal")) return "mensal";
  if (lower.includes("anual")) return "anual";
  if (lower.includes("institucional")) return "institucional";
  return "mensal";
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { pedido_id, dias_override, plano_override, features_override, valor_cobrado, observacao } = await request.json();

  if (!pedido_id) {
    return NextResponse.json({ error: "pedido_id é obrigatório." }, { status: 400 });
  }

  // Busca o pedido
  const [rows] = await pool.execute(
    `SELECT * FROM pedidos WHERE id = ? AND status = 'pendente'`,
    [pedido_id]
  ) as any[];

  if (!rows.length) {
    return NextResponse.json({ error: "Pedido não encontrado ou já processado." }, { status: 404 });
  }

  const pedido = rows[0];
  const plano = plano_override || normalizarPlano(pedido.plano || "mensal");
  const dias = dias_override || PLANO_DIAS[plano] || 30;
  const features = features_override || PLANO_FEATURES[plano] || ["pdf_unlimited"];

  // Chama o signing server
  const signingRes = await fetch(`${process.env.SIGNING_SERVER_URL}/sign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SIGNING_SECRET}`,
    },
    body: JSON.stringify({
      unidade: pedido.nome,
      machine_id: pedido.machine_id,
      plan: plano,
      dias,
      features,
    }),
  });

  if (!signingRes.ok) {
    const err = await signingRes.json();
    return NextResponse.json({ error: `Erro no signing server: ${err.error}` }, { status: 500 });
  }

  const { licenca } = await signingRes.json();
  const licencaJson = JSON.stringify(licenca, null, 2);
  const licencaBase64 = Buffer.from(licencaJson).toString("base64");

  // Salva licença no banco
  await pool.execute(
    `INSERT INTO licencas (pedido_id, unidade, email, plano, machine_id, features, dias, emissao, vencimento, licenca_json, valor_cobrado, observacao)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      pedido_id,
      pedido.nome,
      pedido.email,
      plano,
      pedido.machine_id,
      JSON.stringify(features),
      dias,
      licenca.issued,
      licenca.expiry,
      licencaJson,
      valor_cobrado ?? null,
      observacao ?? null,
    ]
  );

  // Atualiza status do pedido
  await pool.execute(
    `UPDATE pedidos SET status = 'aprovado' WHERE id = ?`,
    [pedido_id]
  );

  // Envia email ao cliente com o .apt_lic em anexo
  const nomeArquivo = `${pedido.nome.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}_${licenca.expiry}.apt_lic`;

  await resend.emails.send({
    from: "ApT <noreply@brunnoml.com.br>",
    to: pedido.email,
    subject: "Sua licença ApT está pronta",
    attachments: [
      {
        filename: nomeArquivo,
        content: licencaBase64,
      },
    ],
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f1419; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #f8fafc; margin: 0; font-size: 20px;">🎙️ Sua licença ApT está pronta</h1>
        </div>
        <div style="background: #151c28; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #1e2836;">
          <p style="color: #f8fafc;">Olá, <strong>${pedido.nome}</strong>!</p>
          <p style="color: #94a3b8;">
            Sua licença ApT está em anexo neste e-mail. Salve o arquivo
            <strong style="color: #f8fafc;">${nomeArquivo}</strong> e carregue-o no app.
          </p>
          <div style="background: #0a0d14; border-radius: 6px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px; color: #94a3b8; font-size: 13px;"><strong style="color: #f8fafc;">Plano:</strong> ${plano}</p>
            <p style="margin: 0 0 8px; color: #94a3b8; font-size: 13px;"><strong style="color: #f8fafc;">Válida até:</strong> ${licenca.expiry}</p>
            <p style="margin: 0; color: #94a3b8; font-size: 13px;"><strong style="color: #f8fafc;">Máquina:</strong> <span style="font-family: monospace;">${pedido.machine_id}</span></p>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">
            Para carregar: abra o ApT → aba Licença → clique em "Carregar arquivo .apt_lic".
          </p>
          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
            Dúvidas? Responda este e-mail.
          </p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ success: true, licenca });
}
