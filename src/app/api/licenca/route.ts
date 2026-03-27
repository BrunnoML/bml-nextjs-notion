import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { nome, email, telefone, plano, profissao, machine_id, mensagem } = await request.json();

    if (!nome || !email) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "E-mail inválido." },
        { status: 400 }
      );
    }

    if (!machine_id || machine_id.replace(/-/g, "").length !== 12) {
      return NextResponse.json(
        { error: "Código da máquina inválido. Use o formato XXXX-XXXX-XXXX exibido no app." },
        { status: 400 }
      );
    }

    // Salva pedido no banco
    await pool.execute(
      `INSERT INTO pedidos (nome, email, telefone, plano, profissao, machine_id, mensagem)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, email, telefone || null, plano || null, profissao || null, machine_id, mensagem || null]
    );

    // Envia email de notificação para o admin
    await resend.emails.send({
      from: "ApT <noreply@brunnoml.com.br>",
      to: "brunnoml@gmail.com",
      subject: `[ApT] Nova solicitação de licença — ${nome}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
          <div style="background: #0f1419; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #f8fafc; margin: 0; font-size: 20px;">🎙️ ApT — Nova solicitação de licença</h1>
          </div>
          <div style="background: #151c28; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #1e2836;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #94a3b8; font-size: 14px; width: 120px;">Nome</td>
                <td style="padding: 10px 0; color: #f8fafc; font-size: 14px;">${nome}</td>
              </tr>
              <tr style="border-top: 1px solid #1e2836;">
                <td style="padding: 10px 0; color: #94a3b8; font-size: 14px;">E-mail</td>
                <td style="padding: 10px 0; color: #f8fafc; font-size: 14px;">
                  <a href="mailto:${email}" style="color: #3b82f6;">${email}</a>
                </td>
              </tr>
              ${telefone ? `
              <tr style="border-top: 1px solid #1e2836;">
                <td style="padding: 10px 0; color: #94a3b8; font-size: 14px;">WhatsApp</td>
                <td style="padding: 10px 0; color: #f8fafc; font-size: 14px;">
                  <a href="https://wa.me/55${telefone.replace(/\D/g, '')}" style="color: #25d366;">${telefone}</a>
                </td>
              </tr>` : ""}
              ${plano ? `
              <tr style="border-top: 1px solid #1e2836;">
                <td style="padding: 10px 0; color: #94a3b8; font-size: 14px;">Plano</td>
                <td style="padding: 10px 0; color: #f8fafc; font-size: 14px; font-weight: bold;">${plano}</td>
              </tr>` : ""}
              ${profissao ? `
              <tr style="border-top: 1px solid #1e2836;">
                <td style="padding: 10px 0; color: #94a3b8; font-size: 14px;">Profissão</td>
                <td style="padding: 10px 0; color: #f8fafc; font-size: 14px;">${profissao}</td>
              </tr>` : ""}
              <tr style="border-top: 1px solid #1e2836;">
                <td style="padding: 10px 0; color: #94a3b8; font-size: 14px;">Máquina</td>
                <td style="padding: 10px 0; color: #f8fafc; font-size: 14px; font-family: monospace;">${machine_id}</td>
              </tr>
              ${mensagem ? `
              <tr style="border-top: 1px solid #1e2836;">
                <td style="padding: 10px 0; color: #94a3b8; font-size: 14px; vertical-align: top;">Mensagem</td>
                <td style="padding: 10px 0; color: #f8fafc; font-size: 14px;">${mensagem.replace(/\n/g, "<br>")}</td>
              </tr>` : ""}
            </table>
            <div style="margin-top: 24px; padding: 16px; background: #0a0d14; border-radius: 6px;">
              <p style="margin: 0 0 8px; color: #64748b; font-size: 12px;">
                Acesse a área admin para aprovar:
              </p>
              <a href="https://brunnoml.com.br/admin" style="color: #3b82f6; font-size: 13px;">
                brunnoml.com.br/admin
              </a>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[licenca/route] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao enviar solicitação. Tente novamente." },
      { status: 500 }
    );
  }
}
