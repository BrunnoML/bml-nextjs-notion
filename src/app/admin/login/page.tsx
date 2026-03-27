"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await signIn("email", { email, redirect: false });
    if (res?.error) {
      setState("error");
    } else {
      setState("sent");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">ApT Admin</h1>
          <p className="text-text-muted text-sm mt-1">Acesso restrito</p>
        </div>

        {state === "sent" ? (
          <div className="card text-center py-10">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-lg font-bold text-text-primary mb-2">Link enviado</h2>
            <p className="text-text-muted text-sm">
              Verifique o e-mail <strong className="text-text-secondary">{email}</strong> e clique no link para entrar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                E-mail do administrador
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="brunnoml@gmail.com"
                className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60 transition-colors"
              />
            </div>

            {state === "error" && (
              <p className="text-sm text-accent-error">
                E-mail não autorizado ou erro ao enviar.
              </p>
            )}

            <button
              type="submit"
              disabled={state === "loading"}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {state === "loading" ? "Enviando..." : "Enviar link de acesso"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
