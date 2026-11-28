"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../admin.css";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      const { error } = await res.json().catch(() => ({ error: "Sign in failed." }));
      setError(error ?? "Sign in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="adm">
      <div className="login">
        <form className="login__box" onSubmit={submit}>
          <span className="adm__mark login__mark" aria-hidden="true">IO</span>
          <h1>Your studio</h1>
          <p>Sign in to edit the portfolio.</p>
          <label className="fld">
            <span className="fld__top"><span className="fld__label">Password</span></span>
            <input
              type="password"
              value={password}
              autoFocus
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="adm__btn adm__btn--go" type="submit" disabled={busy || !password}>
            {busy ? "Checking…" : "Sign in"}
          </button>
          {error && <p className="login__err" role="alert">{error}</p>}
          <a className="login__back" href="/">← Back to the site</a>
        </form>
      </div>
    </div>
  );
}
