"use client";

import Link from "next/link";
import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function LicencaPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    plano: "",
    profissao: "",
    machine_id: "",
    mensagem: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/licenca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
            <strong className="text-text-secondary">(.apt_lic)</strong> por e-mail após confirmação.
          </p>
        </div>

        {formState === "success" ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-text-primary mt-0 mb-2">
              Solicitação enviada!
            </h2>
            <p className="text-text-muted mb-6">
              Retornarei por e-mail em breve com as informações da licença.
            </p>
            <Link href="/produtos/apt" className="btn-secondary inline-block no-underline">
              ← Voltar para o ApT
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-6">

            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-text-secondary mb-2">
                Nome completo <span className="text-accent-error">*</span>
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={form.nome}
                onChange={handleChange}
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
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
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
                id="telefone"
                name="telefone"
                type="tel"
                value={form.telefone}
                onChange={handleChange}
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
                id="plano"
                name="plano"
                value={form.plano}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary focus:outline-none focus:border-accent-primary/60 transition-colors"
              >
                <option value="">Selecione (opcional)</option>
                <option value="Licença Mensal (30 dias)">Licença Mensal — 30 dias</option>
                <option value="Licença Anual (12 meses)">Licença Anual — 12 meses (melhor custo-benefício)</option>
                <option value="Licença Institucional">Licença Institucional — unidade/equipe</option>
              </select>
            </div>

            {/* Profissão */}
            <div>
              <label htmlFor="profissao" className="block text-sm font-medium text-text-secondary mb-2">
                Profissão / Área de atuação
              </label>
              <select
                id="profissao"
                name="profissao"
                value={form.profissao}
                onChange={handleChange}
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
                id="machine_id"
                name="machine_id"
                type="text"
                required
                value={form.machine_id}
                onChange={handleChange}
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
                id="mensagem"
                name="mensagem"
                rows={4}
                value={form.mensagem}
                onChange={handleChange}
                placeholder="Descreva brevemente seu caso de uso (opcional)"
                className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60 transition-colors resize-none"
              />
            </div>

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
              {formState === "loading" ? "Enviando..." : "Enviar solicitação"}
            </button>

            <p className="text-xs text-text-muted text-center">
              Ao enviar, você concorda com os{" "}
              <a
                href="https://github.com/BrunnoML/ApT/blob/main/TERMS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Termos de Uso
              </a>{" "}
              e o{" "}
              <a
                href="https://github.com/BrunnoML/ApT/blob/main/EULA.md"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
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
