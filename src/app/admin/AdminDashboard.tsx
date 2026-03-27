"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

// ── Tipos ─────────────────────────────────────────────────────────────────────

type Pedido = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  plano: string | null;
  profissao: string | null;
  machine_id: string;
  mensagem: string | null;
  status: "pendente" | "aprovado" | "rejeitado";
  criado_em: string;
};

type Licenca = {
  id: number;
  unidade: string;
  email: string;
  plano: string;
  machine_id: string;
  dias: number;
  emissao: string;
  vencimento: string;
  revogada: number;
  valor_cobrado: number | null;
  observacao: string | null;
  criado_em: string;
};

// ── Perfis de preço ───────────────────────────────────────────────────────────

const PERFIS = [
  { key: "degustacao",   label: "Degustação — 7 dias",              dias: 7,   preco: 0,    plano: "institucional", features: ["pdf_unlimited", "logo_custom"] },
  { key: "mensal",       label: "Mensal — 30 dias — R$ 20,00",      dias: 30,  preco: 20,   plano: "mensal",        features: ["pdf_unlimited"] },
  { key: "anual",        label: "Anual — 365 dias — R$ 197,00",     dias: 365, preco: 197,  plano: "anual",         features: ["pdf_unlimited"] },
  { key: "early",        label: "Early adopter — 365 dias — R$ 147,00", dias: 365, preco: 147, plano: "anual",      features: ["pdf_unlimited"] },
  { key: "institucional",label: "Institucional — 365 dias",         dias: 365, preco: 0,    plano: "institucional", features: ["pdf_unlimited", "logo_custom"] },
  { key: "personalizado",label: "Personalizado",                    dias: 0,   preco: 0,    plano: "mensal",        features: ["pdf_unlimited"] },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function fmtDataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR");
}

function vencimentoStatus(vencimento: string, revogada: number) {
  if (revogada) return { label: "Revogada", cls: "bg-red-500/20 text-red-400" };
  const hoje = new Date();
  const venc = new Date(vencimento);
  const diff = Math.ceil((venc.getTime() - hoje.getTime()) / 86400000);
  if (diff < 0) return { label: "Expirada", cls: "bg-zinc-500/20 text-zinc-400" };
  if (diff <= 7) return { label: `Expira em ${diff}d`, cls: "bg-yellow-500/20 text-yellow-400" };
  return { label: "Ativa", cls: "bg-green-500/20 text-green-400" };
}

function normalizarPlanoForm(planoForm: string | null): string {
  const lower = (planoForm || "").toLowerCase();
  if (lower.includes("mensal")) return "mensal";
  if (lower.includes("anual")) return "anual";
  if (lower.includes("institucional")) return "institucional";
  return "mensal";
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [aba, setAba] = useState<"pedidos" | "nova" | "licencas">("pedidos");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [licencas, setLicencas] = useState<Licenca[]>([]);
  const [carregando, setCarregando] = useState(true);

  // estados por pedido
  const [aprovarState, setAprovarState] = useState<Record<number, "idle" | "loading" | "ok" | "error">>({});
  const [pedidoPerfil, setPedidoPerfil] = useState<Record<number, string>>({});
  const [pedidoDias, setPedidoDias] = useState<Record<number, string>>({});
  const [pedidoValor, setPedidoValor] = useState<Record<number, string>>({});
  const [pedidoObs, setPedidoObs] = useState<Record<number, string>>({});

  // nova licença
  const [novaForm, setNovaForm] = useState({
    nome: "", email: "", machine_id: "", perfil: "degustacao",
    dias: "7", preco: "0", plano: "institucional",
    features: ["pdf_unlimited", "logo_custom"], observacao: "",
  });
  const [novaState, setNovaState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [novaErro, setNovaErro] = useState("");

  // filtro licenças
  const [filtroLic, setFiltroLic] = useState<"todas" | "ativas" | "expiradas" | "revogadas">("ativas");

  async function carregarPedidos() {
    setCarregando(true);
    const res = await fetch("/api/admin/pedidos");
    const data = await res.json();
    setPedidos(data.pedidos || []);
    setCarregando(false);
  }

  async function carregarLicencas() {
    const res = await fetch("/api/admin/licencas");
    const data = await res.json();
    setLicencas(data.licencas || []);
  }

  useEffect(() => {
    carregarPedidos();
    carregarLicencas();
  }, []);

  // ── Aprovar pedido ──────────────────────────────────────────────────────────

  async function aprovar(pedido: Pedido) {
    setAprovarState((s) => ({ ...s, [pedido.id]: "loading" }));

    const perfilKey = pedidoPerfil[pedido.id] || "mensal";
    const perfil = PERFIS.find((p) => p.key === perfilKey) || PERFIS[1];
    const isPersonalizado = perfilKey === "personalizado";

    const dias = isPersonalizado
      ? Number(pedidoDias[pedido.id] || 30)
      : perfil.dias;

    const plano = perfil.plano !== "mensal" ? perfil.plano : normalizarPlanoForm(pedido.plano);
    const features = perfil.features;
    const valor = pedidoValor[pedido.id] !== undefined
      ? Number(pedidoValor[pedido.id])
      : perfil.preco;

    const res = await fetch("/api/admin/aprovar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pedido_id: pedido.id,
        dias_override: dias,
        plano_override: plano,
        features_override: features,
        valor_cobrado: valor,
        observacao: pedidoObs[pedido.id] || null,
      }),
    });

    if (res.ok) {
      setAprovarState((s) => ({ ...s, [pedido.id]: "ok" }));
      setTimeout(() => { carregarPedidos(); carregarLicencas(); }, 1000);
    } else {
      setAprovarState((s) => ({ ...s, [pedido.id]: "error" }));
    }
  }

  async function rejeitar(pedido: Pedido) {
    await fetch("/api/admin/rejeitar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pedido_id: pedido.id }),
    });
    carregarPedidos();
  }

  // ── Nova licença manual ─────────────────────────────────────────────────────

  function onPerfilChange(key: string) {
    const p = PERFIS.find((x) => x.key === key);
    if (!p) return;
    setNovaForm((f) => ({
      ...f,
      perfil: key,
      dias: String(p.dias),
      preco: String(p.preco),
      plano: p.plano,
      features: p.features,
    }));
  }

  async function gerarNovaLicenca(e: React.FormEvent) {
    e.preventDefault();
    setNovaState("loading");
    setNovaErro("");

    const res = await fetch("/api/admin/nova-licenca", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: novaForm.nome,
        email: novaForm.email,
        machine_id: novaForm.machine_id,
        plano: novaForm.plano,
        dias: Number(novaForm.dias),
        features: novaForm.features,
        valor_cobrado: Number(novaForm.preco) || null,
        observacao: novaForm.observacao || null,
      }),
    });

    if (res.ok) {
      setNovaState("ok");
      setNovaForm({ nome: "", email: "", machine_id: "", perfil: "degustacao", dias: "7", preco: "0", plano: "institucional", features: ["pdf_unlimited", "logo_custom"], observacao: "" });
      carregarLicencas();
      setTimeout(() => setNovaState("idle"), 3000);
    } else {
      const data = await res.json();
      setNovaErro(data.error || "Erro ao gerar licença.");
      setNovaState("error");
    }
  }

  // ── Revogar licença ─────────────────────────────────────────────────────────

  async function revogar(id: number) {
    if (!confirm("Confirma revogar esta licença? O usuário perderá o acesso.")) return;
    await fetch("/api/admin/revogar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenca_id: id }),
    });
    carregarLicencas();
  }

  // ── Filtro licenças ─────────────────────────────────────────────────────────

  const licencasFiltradas = licencas.filter((l) => {
    if (filtroLic === "todas") return true;
    if (filtroLic === "revogadas") return l.revogada === 1;
    const hoje = new Date();
    const venc = new Date(l.vencimento);
    if (filtroLic === "ativas") return !l.revogada && venc >= hoje;
    if (filtroLic === "expiradas") return !l.revogada && venc < hoje;
    return true;
  });

  const pendentes = pedidos.filter((p) => p.status === "pendente").length;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">ApT Admin</h1>
            <p className="text-text-muted text-sm mt-0.5">Gerenciamento de licenças</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="text-sm text-text-muted hover:text-text-secondary transition-colors">
            Sair
          </button>
        </div>

        {/* Abas */}
        <div className="flex gap-1 mb-6 bg-dark-800 rounded-xl p-1">
          {([
            { key: "pedidos", label: `Pedidos${pendentes > 0 ? ` (${pendentes})` : ""}` },
            { key: "nova",    label: "Nova Licença" },
            { key: "licencas",label: `Licenças (${licencas.filter(l => !l.revogada && new Date(l.vencimento) >= new Date()).length})` },
          ] as const).map((a) => (
            <button
              key={a.key}
              onClick={() => setAba(a.key)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                aba === a.key ? "bg-accent-primary text-white" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* ── ABA: PEDIDOS ── */}
        {aba === "pedidos" && (
          <div className="space-y-4">
            {/* sub-filtro */}
            <div className="flex gap-2">
              {(["pendente", "aprovado", "rejeitado", "todos"] as const).map((f) => (
                <button key={f} onClick={() => setPedidos((prev) => prev)} className="text-xs px-3 py-1 rounded-full bg-dark-800 text-text-muted capitalize">
                  {f}
                </button>
              ))}
            </div>

            {carregando ? (
              <p className="text-text-muted text-center py-12">Carregando...</p>
            ) : pedidos.length === 0 ? (
              <div className="card text-center py-12 text-text-muted">Nenhum pedido encontrado.</div>
            ) : (
              pedidos.map((pedido) => {
                const perfilKey = pedidoPerfil[pedido.id] || "mensal";
                const perfil = PERFIS.find((p) => p.key === perfilKey) || PERFIS[1];
                const isPersonalizado = perfilKey === "personalizado";
                const valorAtual = pedidoValor[pedido.id] !== undefined ? pedidoValor[pedido.id] : String(perfil.preco);

                return (
                  <div key={pedido.id} className="card">
                    <div className="flex items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-0 space-y-1 text-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-text-primary text-base">{pedido.nome}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            pedido.status === "pendente" ? "bg-yellow-500/20 text-yellow-400" :
                            pedido.status === "aprovado" ? "bg-green-500/20 text-green-400" :
                            "bg-red-500/20 text-red-400"
                          }`}>{pedido.status}</span>
                        </div>
                        <p className="text-text-muted">
                          <span className="text-text-secondary">E-mail:</span>{" "}
                          <a href={`mailto:${pedido.email}`} className="text-accent-primary hover:underline">{pedido.email}</a>
                        </p>
                        {pedido.telefone && (
                          <p className="text-text-muted">
                            <span className="text-text-secondary">WhatsApp:</span>{" "}
                            <a href={`https://wa.me/55${pedido.telefone.replace(/\D/g,"")}`} className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">{pedido.telefone}</a>
                          </p>
                        )}
                        {pedido.plano && <p className="text-text-muted"><span className="text-text-secondary">Plano solicitado:</span> {pedido.plano}</p>}
                        {pedido.profissao && <p className="text-text-muted"><span className="text-text-secondary">Profissão:</span> {pedido.profissao}</p>}
                        <p className="text-text-muted"><span className="text-text-secondary">Máquina:</span> <span className="font-mono text-text-primary">{pedido.machine_id}</span></p>
                        {pedido.mensagem && <p className="text-text-muted"><span className="text-text-secondary">Mensagem:</span> {pedido.mensagem}</p>}
                        <p className="text-xs text-text-muted">{fmtDataHora(pedido.criado_em)}</p>
                      </div>

                      {pedido.status === "pendente" && (
                        <div className="flex flex-col gap-2 w-48 shrink-0">
                          {/* Perfil */}
                          <select
                            value={perfilKey}
                            onChange={(e) => setPedidoPerfil((s) => ({ ...s, [pedido.id]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-dark-600 text-text-primary text-sm focus:outline-none focus:border-accent-primary/60"
                          >
                            {PERFIS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                          </select>

                          {/* Dias (só personalizado) */}
                          {isPersonalizado && (
                            <input
                              type="number"
                              placeholder="Dias"
                              value={pedidoDias[pedido.id] || ""}
                              onChange={(e) => setPedidoDias((s) => ({ ...s, [pedido.id]: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-dark-600 text-text-primary text-sm focus:outline-none focus:border-accent-primary/60"
                            />
                          )}

                          {/* Valor cobrado */}
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">R$</span>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Valor"
                              value={valorAtual}
                              onChange={(e) => setPedidoValor((s) => ({ ...s, [pedido.id]: e.target.value }))}
                              className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-900 border border-dark-600 text-text-primary text-sm focus:outline-none focus:border-accent-primary/60"
                            />
                          </div>

                          {/* Observação */}
                          <input
                            type="text"
                            placeholder="Observação (opcional)"
                            value={pedidoObs[pedido.id] || ""}
                            onChange={(e) => setPedidoObs((s) => ({ ...s, [pedido.id]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-dark-600 text-text-primary text-sm focus:outline-none focus:border-accent-primary/60"
                          />

                          {/* Pix info */}
                          {Number(valorAtual) > 0 && (
                            <p className="text-xs text-text-muted text-center">PIX: brunnoml@gmail.com</p>
                          )}

                          <button
                            onClick={() => aprovar(pedido)}
                            disabled={aprovarState[pedido.id] === "loading"}
                            className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors disabled:opacity-60"
                          >
                            {aprovarState[pedido.id] === "loading" ? "Gerando..." :
                             aprovarState[pedido.id] === "ok" ? "Enviado ✓" :
                             aprovarState[pedido.id] === "error" ? "Erro ✗" : "Aprovar"}
                          </button>
                          <button
                            onClick={() => rejeitar(pedido)}
                            className="w-full py-2 rounded-lg bg-dark-700 hover:bg-red-900/40 text-text-muted hover:text-red-400 text-sm font-medium transition-colors"
                          >
                            Rejeitar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── ABA: NOVA LICENÇA ── */}
        {aba === "nova" && (
          <form onSubmit={gerarNovaLicenca} className="card space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Gerar licença manual</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Nome *</label>
                <input required value={novaForm.nome} onChange={(e) => setNovaForm((f) => ({ ...f, nome: e.target.value }))}
                  placeholder="Nome completo ou unidade"
                  className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">E-mail *</label>
                <input required type="email" value={novaForm.email} onChange={(e) => setNovaForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Código da máquina *</label>
              <input required value={novaForm.machine_id} onChange={(e) => setNovaForm((f) => ({ ...f, machine_id: e.target.value }))}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60 font-mono tracking-widest" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Perfil de licença</label>
              <select value={novaForm.perfil} onChange={(e) => onPerfilChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary focus:outline-none focus:border-accent-primary/60">
                {PERFIS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Dias de validade</label>
                <input type="number" required value={novaForm.dias} onChange={(e) => setNovaForm((f) => ({ ...f, dias: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary focus:outline-none focus:border-accent-primary/60" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Valor cobrado (R$)</label>
                <input type="number" step="0.01" value={novaForm.preco} onChange={(e) => setNovaForm((f) => ({ ...f, preco: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary focus:outline-none focus:border-accent-primary/60" />
              </div>
            </div>

            {Number(novaForm.preco) > 0 && (
              <p className="text-sm text-text-muted">PIX para pagamento: <strong className="text-text-secondary">brunnoml@gmail.com</strong></p>
            )}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Observação (opcional)</label>
              <input type="text" value={novaForm.observacao} onChange={(e) => setNovaForm((f) => ({ ...f, observacao: e.target.value }))}
                placeholder="Ex: trial FICCO-PE, desconto colega..."
                className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60" />
            </div>

            {novaState === "error" && (
              <p className="text-sm text-accent-error">{novaErro}</p>
            )}
            {novaState === "ok" && (
              <p className="text-sm text-green-400">Licença gerada e enviada por e-mail.</p>
            )}

            <button type="submit" disabled={novaState === "loading"}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
              {novaState === "loading" ? "Gerando..." : "Gerar e enviar licença"}
            </button>
          </form>
        )}

        {/* ── ABA: LICENÇAS ── */}
        {aba === "licencas" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {(["ativas", "expiradas", "revogadas", "todas"] as const).map((f) => (
                <button key={f} onClick={() => setFiltroLic(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filtroLic === f ? "bg-accent-primary text-white" : "bg-dark-800 text-text-muted hover:text-text-secondary"
                  }`}>
                  {f}
                </button>
              ))}
            </div>

            {licencasFiltradas.length === 0 ? (
              <div className="card text-center py-12 text-text-muted">Nenhuma licença {filtroLic}.</div>
            ) : (
              licencasFiltradas.map((lic) => {
                const status = vencimentoStatus(lic.vencimento, lic.revogada);
                return (
                  <div key={lic.id} className="card">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0 space-y-1 text-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-text-primary">{lic.unidade}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.cls}`}>{status.label}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-dark-700 text-text-muted capitalize">{lic.plano}</span>
                        </div>
                        <p className="text-text-muted"><span className="text-text-secondary">E-mail:</span> {lic.email}</p>
                        <p className="text-text-muted"><span className="text-text-secondary">Máquina:</span> <span className="font-mono text-text-primary">{lic.machine_id.toUpperCase().replace(/(.{4})(.{4})(.{4})/, "$1-$2-$3")}</span></p>
                        <p className="text-text-muted"><span className="text-text-secondary">Validade:</span> {fmtData(lic.emissao)} → {fmtData(lic.vencimento)} ({lic.dias} dias)</p>
                        {lic.valor_cobrado !== null && (
                          <p className="text-text-muted"><span className="text-text-secondary">Valor:</span> R$ {Number(lic.valor_cobrado).toFixed(2).replace(".", ",")}</p>
                        )}
                        {lic.observacao && (
                          <p className="text-text-muted"><span className="text-text-secondary">Obs:</span> {lic.observacao}</p>
                        )}
                        <p className="text-xs text-text-muted">Emitida em {fmtDataHora(lic.criado_em)}</p>
                      </div>

                      {!lic.revogada && (
                        <button onClick={() => revogar(lic.id)}
                          className="px-4 py-2 rounded-lg bg-dark-700 hover:bg-red-900/40 text-text-muted hover:text-red-400 text-sm font-medium transition-colors shrink-0">
                          Revogar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}
