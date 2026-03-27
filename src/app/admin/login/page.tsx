"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/admin");
    } else {
      setState("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">ApT Admin</h1>
          <p className="text-text-muted text-sm mt-1">Acesso restrito</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
              E-mail
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-dark-600 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/60 transition-colors"
            />
          </div>

          {state === "error" && (
            <p className="text-sm text-accent-error">
              E-mail ou senha incorretos.
            </p>
          )}

          <button
            type="submit"
            disabled={state === "loading"}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {state === "loading" ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
