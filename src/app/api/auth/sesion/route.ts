import { NextResponse } from "next/server";
import { z } from "zod";
import { adminAuth } from "@/lib/firebase-admin";
import { HttpError, manejar } from "@/lib/errors";
import { verificarOrigen } from "@/lib/auth";

export const runtime = "nodejs";
const DIAS = 5;

export const POST = manejar(async (req) => {
  verificarOrigen(req);
  const { idToken } = z.object({ idToken: z.string().min(10) }).strict().parse(await req.json());
  const t = await adminAuth.verifyIdToken(idToken).catch(() => { throw new HttpError(401, "Token inválido"); });
  if (Date.now() / 1000 - t.auth_time > 300) throw new HttpError(401, "Inicia sesión de nuevo");
  const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn: DIAS * 86400 * 1000 });
  const res = new NextResponse(null, { status: 204 });
  res.cookies.set("sesion", cookie, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: DIAS * 86400 });
  return res;
});

export const DELETE = manejar(async (req) => {
  verificarOrigen(req);
  const res = new NextResponse(null, { status: 204 });
  res.cookies.delete("sesion");
  return res;
});
