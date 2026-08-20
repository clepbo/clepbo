"use client";

import { useRef, useState } from "react";
import type { Content } from "@/lib/types";

type State = "idle" | "sending" | "sent" | "error";

export default function ContactForm({
  form, channels, email,
}: {
  form: Content["contact"]["form"];
  channels: { id: number; name: string }[];
  email: string;
}) {
  const openedAt = useRef(Date.now());
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setState("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          need: data.get("need"),
          message: data.get("message"),
          company: data.get("company"),
          openedAt: openedAt.current,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Sending failed.");
      setNote(body.confirmed ? "" : "Your message reached me, but the confirmation email didn't send.");
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : `Sending failed. Email ${email} directly.`);
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="enq enq--done" role="status">
        <p className="enq__done-head">{form.success}</p>
        {note && <p className="enq__note">{note}</p>}
      </div>
    );
  }

  return (
    <form className="enq" onSubmit={submit} noValidate>
      <p className="enq__head">{form.heading}</p>
      {form.note && <p className="enq__note">{form.note}</p>}

      <div className="enq__row">
        <label className="enq__field">
          <span className="enq__label">Your name</span>
          <input name="name" type="text" required autoComplete="name" maxLength={120} />
        </label>
        <label className="enq__field">
          <span className="enq__label">Email</span>
          <input name="email" type="email" required autoComplete="email" maxLength={200} />
        </label>
      </div>

      <label className="enq__field">
        <span className="enq__label">What do you need?</span>
        <select name="need" defaultValue={channels[0]?.name ?? "Something else"}>
          {channels.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          <option value="Something else">Something else</option>
        </select>
      </label>

      <label className="enq__field">
        <span className="enq__label">What are you trying to get done?</span>
        <textarea name="message" required rows={5} maxLength={5000}
          placeholder="What it is, who it's for, and when you need it." />
      </label>

      {/* Not for people. Left unlabelled and hidden from assistive tech. */}
      <div className="enq__trap" aria-hidden="true">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button className="enq__send" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : form.button}
      </button>

      {error && <p className="enq__error" role="alert">{error}</p>}
    </form>
  );
}
