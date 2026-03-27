import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";
import pool from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { nome, email, machine_id, plano, dias, features, valor_cobrado, observacao } =
    await request.json();

  if (!nome || !email || !machine_id || !plano || !dias) {
    return NextResponse.json({ error: "Campos obrigatórios: nome, email, machine_id, plano, dias." }, { status: 400 });
  }

  if (machine_id.replace(/-/g, "").length !== 12) {
    return NextResponse.json({ error: "machine_id inválido. Use o formato XXXX-XXXX-XXXX." }, { status: 400 });
  }

  const featuresFinais = features?.length ? features : ["pdf_unlimited"];

  // Chama signing server
  const signingRes = await fetch(`${process.env.SIGNING_SERVER_URL}/sign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SIGNING_SECRET}`,
    },
    body: JSON.stringify({
      unidade: nome,
      machine_id,
      plan: plano,
      dias: Number(dias),
      features: featuresFinais,
    }),
  });

  if (!signingRes.ok) {
    const err = await signingRes.json();
    return NextResponse.json({ error: `Erro no signing server: ${err.error}` }, { status: 500 });
  }

  const { licenca } = await signingRes.json();
  const licencaJson = JSON.stringify(licenca, null, 2);
  const licencaBase64 = Buffer.from(licencaJson).toString("base64");

  // Salva no banco (sem pedido_id — licença manual tem pedido_id = NULL)
  await pool.execute(
    `INSERT INTO licencas (pedido_id, unidade, email, plano, machine_id, features, dias, emissao, vencimento, licenca_json, valor_cobrado, observacao)
     VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nome,
      email,
      plano,
      machine_id.replace(/-/g, "").toLowerCase(),
      JSON.stringify(featuresFinais),
      Number(dias),
      licenca.issued,
      licenca.expiry,
      licencaJson,
      valor_cobrado ?? null,
      observacao ?? null,
    ]
  );

  const nomeArquivo = `${nome.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}_${licenca.expiry}.apt_lic`;

  await resend.emails.send({
    from: "ApT <noreply@brunnoml.com.br>",
    to: email,
    subject: "Sua licença ApT está pronta",
    attachments: [{ filename: nomeArquivo, content: licencaBase64 }],
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f1419; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #f8fafc; margin: 0; font-size: 20px;">🎙️ Sua licença ApT está pronta</h1>
        </div>
        <div style="background: #151c28; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #1e2836;">
          <p style="color: #f8fafc;">Olá, <strong>${nome}</strong>!</p>
          <p style="color: #94a3b8;">Sua licença ApT está em anexo. Salve o arquivo <strong style="color:#f8fafc">${nomeArquivo}</strong> e carregue no app.</p>
          <div style="background:#0a0d14;border-radius:6px;padding:16px;margin:16px 0;">
            <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;"><strong style="color:#f8fafc">Plano:</strong> ${plano}</p>
            <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;"><strong style="color:#f8fafc">Válida até:</strong> ${licenca.expiry}</p>
            <p style="margin:0;color:#94a3b8;font-size:13px;"><strong style="color:#f8fafc">Máquina:</strong> <span style="font-family:monospace">${machine_id}</span></p>
          </div>
          ${valor_cobrado > 0 ? `
          <div style="background:#0a0d14;border-radius:6px;padding:16px;margin:16px 0;border:1px solid #1e2836;">
            <p style="margin:0 0 4px;color:#94a3b8;font-size:13px;"><strong style="color:#f8fafc">Valor:</strong> R$ ${Number(valor_cobrado).toFixed(2).replace(".", ",")}</p>
            <p style="margin:0;color:#94a3b8;font-size:13px;"><strong style="color:#f8fafc">PIX:</strong> brunnoml@gmail.com</p>
          </div>` : ""}
          <p style="color:#94a3b8;font-size:13px;">Para carregar: abra o ApT → aba Licença → clique em "Carregar arquivo .apt_lic".</p>
          <p style="color:#64748b;font-size:12px;margin-top:24px;">Dúvidas? Responda este e-mail.</p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ success: true, licenca });
}
