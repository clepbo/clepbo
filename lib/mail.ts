import { Resend } from "resend";
import nodemailer from "nodemailer";
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

type Letter = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
};

/** Two ways to send. Gmail needs no domain of your own, so confirmations reach
 *  real people from day one; Resend is the better long-term home once you have
 *  a domain. Whichever is configured wins, Gmail first. */
function transport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    const mailer = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
    return {
      name: "gmail" as const,
      /* Gmail rewrites a From header that is not the authenticated account, so
         the display name is honoured and the address is forced. */
      send: async (l: Letter) => {
        const name = l.from.match(/^\s*"?([^"<]+?)"?\s*</)?.[1]?.trim();
        await mailer.sendMail({ ...l, from: name ? `"${name}" <${user}>` : user });
      },
    };
  }

  const key = process.env.RESEND_API_KEY;
  if (key) {
    const resend = new Resend(key);
    return {
      name: "resend" as const,
      send: async (l: Letter) => {
        const { error } = await resend.emails.send({
          from: l.from, to: l.to, replyTo: l.replyTo,
          subject: l.subject, html: l.html, text: l.text,
        });
        if (error) throw new Error(error.message);
      },
    };
  }

  throw new Error(
    "No email provider configured. Set GMAIL_USER and GMAIL_APP_PASSWORD, or RESEND_API_KEY.",
  );
}

export async function sendEnquiry(enquiry: Enquiry, content: Content, site: string) {
  const { form } = content.contact;
  const to = form.deliverTo?.trim() || content.contact.email;
  const from = form.from?.trim() || process.env.GMAIL_USER || "onboarding@resend.dev";
  const post = transport();

  // The one that matters. If this fails the whole request fails.
  await post.send({
    from,
    to,
    replyTo: enquiry.email,
    subject: `Enquiry — ${enquiry.need} — ${enquiry.name}`,
    html: notifyHtml(enquiry, site),
    text: textOf(enquiry),
  });

  /* The confirmation is a courtesy. If it bounces — most often because a Resend
     sending domain is not verified yet — the enquiry still reached the inbox,
     so we log it and let the sender see success. */
  let confirmed = true;
  try {
    await post.send({
      from,
      to: enquiry.email,
      replyTo: to,
      subject: form.replySubject || "I've got your message",
      html: replyHtml(form.replyBody, enquiry.name, site),
      text: `Hi ${enquiry.name.split(" ")[0] || "there"},\n\n${form.replyBody}\n`,
    });
  } catch (err) {
    console.error("confirmation email failed:", err);
    confirmed = false;
  }

  return { confirmed, via: post.name };
}
