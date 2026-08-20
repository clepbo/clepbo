import { NextResponse } from "next/server";
import { mintToken, passwordMatches, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set on this deployment." },
      { status: 500 },
    );
  }
  if (!password || !passwordMatches(password)) {
    // Deliberately vague: a wrong password should not say which part was wrong.
    return NextResponse.json({ error: "That password didn't work." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, mintToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
