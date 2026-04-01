"use client";

import Link from "next/link";
import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

const PLANOS = [
  { value: "", label: "Selecione (opcional)", preco: null, descricao: "" },
  { value: "Licença Mensal (30 dias)", label: "Licença Mensal — 30 dias", preco: 20, descricao: "R$ 20,00" },
  { value: "Licença Anual (12 meses)", label: "Licença Anual — 12 meses (melhor custo-benefício)", preco: 197, descricao: "R$ 197,00" },
  { value: "Licença Institucional", label: "Licença Institucional — unidade/equipe", preco: null, descricao: "Valor negociado após contato" },
];

const PIX_KEY = "brunnoml@gmail.com";

export default function LicencaPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [pixConfirmado, setPixConfirmado] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    plano: "",
    profissao: "",
    machine_id: "",
    mensagem: "",
  });

  const planoSelecionado = PLANOS.find((p) => p.value === form.plano) || PLANOS[0];
  const temPrecoFixo = planoSelecionado.preco !== null;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "plano") setPixConfirmado(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/licenca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pix_confirmado: pixConfirmado }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao enviar. Tente novamente.");
        setFormState("error");
        return;
      }

      setFormState("success");
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente.");
      setFormState("error");
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/produtos" className="hover:text-text-secondary transition-colors no-underline">
            Produtos
          </Link>
          <span>/</span>
          <Link href="/produtos/apt" className="hover:text-text-secondary transition-colors no-underline">
            ApT
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Solicitar Licença</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mt-0 mb-2">Solicitar Licença</h1>
          <p className="text-text-muted">
            Preencha o formulário abaixo. Você receberá o arquivo de licença{" "}
            <strong className="text-text-secondary">(.apt_lic)</strong> por e-mail após confirmação do pagamento.
          </p>
        </div>

        {formState === "success" ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">{pixConfirmado ? "⏳" : "✅"}</div>
            <h2 className="text-xl font-bold text-text-primary mt-0 mb-2">
              Solicitação enviada!
            </h2>
            <p className="text-text-muted mb-2">
              {pixConfirmado
                ? "Confirmei o recebimento do seu pedido. Assim que verificar o pagamento, enviarei a licença por e-mail."
                : "Entrarei em contato por e-mail em breve com as informações de pagamento e da licença."}
            </p>
            {pixConfirmado && (
              <p className="text-xs text-text-muted mb-6">
                A liberação ocorre em até algumas horas em dias úteis.
              </p>
            )}
            <Link href="/produtos/apt" className="btn-secondary inline-block no-underline">
              ← Voltar para o ApT
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Campos do formulário */}
            <div className="card space-y-6">

              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-text-secondary mb-2">
                  Nome completo <span className="text-accent-error">*</span>
                </label>
                <input
                  id="nome" name="nome" type="text" required
                  value={form.nome} onChange={handleChange}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  E-mail <span className="text-accent-error">*</span>
                </label>
                <input
                  id="email" name="email" type="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60 transition-colors"
                />
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-text-secondary mb-2">
                  WhatsApp / Telefone
                </label>
                <input
                  id="telefone" name="telefone" type="tel"
                  value={form.telefone} onChange={handleChange}
                  placeholder="(81) 99999-9999 (opcional)"
                  className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60 transition-colors"
                />
              </div>

              {/* Plano */}
              <div>
                <label htmlFor="plano" className="block text-sm font-medium text-text-secondary mb-2">
                  Plano desejado
                </label>
                <select
                  id="plano" name="plano"
                  value={form.plano} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary focus:outline-none focus:border-accent-primary/60 transition-colors"
                >
                  {PLANOS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Profissão */}
              <div>
                <label htmlFor="profissao" className="block text-sm font-medium text-text-secondary mb-2">
                  Profissão / Área de atuação
                </label>
                <select
                  id="profissao" name="profissao"
                  value={form.profissao} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary focus:outline-none focus:border-accent-primary/60 transition-colors"
                >
                  <option value="">Selecione (opcional)</option>
                  <option value="Escrivão / Agente de Polícia">Escrivão / Agente de Polícia</option>
                  <option value="Delegado / Investigador">Delegado / Investigador</option>
                  <option value="Advogado / Defensor Público">Advogado / Defensor Público</option>
                  <option value="Promotor / Magistrado">Promotor / Magistrado</option>
                  <option value="Perito / Analista">Perito / Analista</option>
                  <option value="Estudante / Pesquisador">Estudante / Pesquisador</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              {/* Código da máquina */}
              <div>
                <label htmlFor="machine_id" className="block text-sm font-medium text-text-secondary mb-2">
                  Código da máquina <span className="text-accent-error">*</span>
                </label>
                <input
                  id="machine_id" name="machine_id" type="text" required
                  value={form.machine_id} onChange={handleChange}
                  placeholder="XXXX-XXXX-XXXX (exibido na aba Licença do ApT)"
                  className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60 transition-colors font-mono tracking-widest"
                />
                <p className="text-xs text-text-muted mt-1">
                  Abra o ApT → aba Licença → copie o código exibido
                </p>
              </div>

              {/* Mensagem */}
              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-text-secondary mb-2">
                  Mensagem
                </label>
                <textarea
                  id="mensagem" name="mensagem" rows={3}
                  value={form.mensagem} onChange={handleChange}
                  placeholder="Descreva brevemente seu caso de uso (opcional)"
                  className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Bloco PIX — aparece quando plano tem preço fixo */}
            {temPrecoFixo && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">💰</span>
                  <h3 className="text-sm font-semibold text-green-400 mt-0 mb-0">
                    Pagamento via PIX
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-dark-900/60 rounded-lg px-4 py-3">
                    <span className="text-text-muted text-sm">Valor</span>
                    <span className="text-text-primary font-bold text-lg">
                      R$ {planoSelecionado.preco?.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-dark-900/60 rounded-lg px-4 py-3">
                    <span className="text-text-muted text-sm">Chave PIX</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(PIX_KEY)}
                      className="font-mono text-green-400 hover:text-green-300 transition-colors text-sm flex items-center gap-1.5"
                      title="Clique para copiar"
                    >
                      {PIX_KEY}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-text-muted">
                  Após efetuar o pagamento, marque a opção abaixo. A licença será liberada após confirmação do recebimento.
                </p>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={pixConfirmado}
                    onChange={(e) => setPixConfirmado(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-green-500 cursor-pointer"
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    Já efetuei o PIX de{" "}
                    <strong className="text-green-400">
                      R$ {planoSelecionado.preco?.toFixed(2).replace(".", ",")}
                    </strong>{" "}
                    para <strong className="text-green-400">{PIX_KEY}</strong>
                  </span>
                </label>
              </div>
            )}

            {/* Institucional — sem preço fixo */}
            {form.plano === "Licença Institucional" && (
              <div className="rounded-xl border border-dark-600 bg-dark-900/50 p-4">
                <p className="text-sm text-text-muted">
                  Para licenças institucionais o valor é negociado conforme o número de usuários.
                  Após enviar o formulário entrarei em contato para alinhar os detalhes.
                </p>
              </div>
            )}

            {/* Error */}
            {formState === "error" && (
              <div className="px-4 py-3 rounded-lg bg-accent-error/10 border border-accent-error/30 text-accent-error text-sm">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={formState === "loading"}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {formState === "loading"
                ? "Enviando..."
                : pixConfirmado
                ? "Enviar solicitação + confirmar PIX"
                : "Enviar solicitação"}
            </button>

            <p className="text-xs text-text-muted text-center">
              Ao enviar, você concorda com os{" "}
              <a href="https://github.com/BrunnoML/ApT/blob/main/TERMS.md" target="_blank" rel="noopener noreferrer" className="underline">
                Termos de Uso
              </a>{" "}
              e o{" "}
              <a href="https://github.com/BrunnoML/ApT/blob/main/EULA.md" target="_blank" rel="noopener noreferrer" className="underline">
                EULA
              </a>{" "}
              do ApT.
            </p>

          </form>
        )}

      </div>
    </div>
  );
}
