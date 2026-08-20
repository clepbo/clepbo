import { Resend } from "resend";
import type { Content } from "./types";

/** Everything the contact route needs to send its two emails. */
export type Enquiry = {
  name: string;
  email: string;
  need: string;
  message: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const para = (s: string) =>
  esc(s).split(/\n{2,}/).map((p) => `<p style="margin:0 0 14px">${p.replace(/\n/g, "<br>")}</p>`).join("");

/* Plain, legible email. No images, no tracking, no layout that breaks in
   Outlook — the content is the point. */
function shell(inner: string, footer: string) {
  return `<!doctype html><html><body style="margin:0;background:#16181A;padding:28px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="100%" style="max-width:560px" cellpadding="0" cellspacing="0">
      <tr><td style="background:#1C1F21;border:1px solid rgba(233,231,224,.14);padding:28px 26px;
        font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
        font-size:15px;line-height:1.6;color:#E9E7E0">${inner}</td></tr>
      <tr><td style="padding:14px 4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
        font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#868C88">${esc(footer)}</td></tr>
    </table>
  </td></tr></table></body></html>`;
}

function notifyHtml(e: Enquiry, site: string) {
  const rows = [
    ["From", e.name],
    ["Email", e.email],
    ["Needs", e.need],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#868C88;font-size:12px;text-transform:uppercase;
          letter-spacing:.1em;white-space:nowrap">${esc(k)}</td>
         <td style="padding:6px 0;color:#E9E7E0">${esc(v)}</td></tr>`,
    )
    .join("");

  return shell(
    `<p style="margin:0 0 18px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#35D6C4">
       New enquiry</p>
     <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px">${rows}</table>
     <div style="border-top:1px solid rgba(233,231,224,.14);padding-top:18px;color:#9DA29F">
       ${para(e.message)}
     </div>
     <p style="margin:22px 0 0">
       <a href="mailto:${esc(e.email)}" style="color:#35D6C4">Reply to ${esc(e.name)} →</a>
     </p>`,
    `Sent from ${site}`,
  );
}

function replyHtml(body: string, name: string, site: string) {
  return shell(
    `<p style="margin:0 0 14px">Hi ${esc(name.split(" ")[0] || "there")},</p>${para(body)}`,
    `${site} · this is an automatic confirmation`,
  );
}

const textOf = (e: Enquiry) =>
  `New enquiry\n\nFrom: ${e.name}\nEmail: ${e.email}\nNeeds: ${e.need}\n\n${e.message}\n`;

export async function sendEnquiry(enquiry: Enquiry, content: Content, site: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set on this deployment.");

  const { form } = content.contact;
  const to = form.deliverTo?.trim() || content.contact.email;
  const from = form.from?.trim() || "onboarding@resend.dev";
  const resend = new Resend(key);

  // The one that matters. If this fails the whole request fails.
  const notify = await resend.emails.send({
    from,
    to,
    replyTo: enquiry.email,
    subject: `Enquiry — ${enquiry.need} — ${enquiry.name}`,
    html: notifyHtml(enquiry, site),
    text: textOf(enquiry),
  });
  if (notify.error) throw new Error(notify.error.message);

  /* The confirmation is a courtesy. If it bounces — most often because the
     sending domain is not verified yet — the enquiry still reached the inbox,
     so we log it and let the sender see success. */
  let confirmed = true;
  try {
    const ack = await resend.emails.send({
      from,
      to: enquiry.email,
      replyTo: to,
      subject: form.replySubject || "I've got your message",
      html: replyHtml(form.replyBody, enquiry.name, site),
      text: `Hi ${enquiry.name.split(" ")[0] || "there"},\n\n${form.replyBody}\n`,
    });
    if (ack.error) throw new Error(ack.error.message);
  } catch (err) {
    console.error("confirmation email failed:", err);
    confirmed = false;
  }

  return { confirmed };
}
