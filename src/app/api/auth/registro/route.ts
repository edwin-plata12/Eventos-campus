import { NextResponse } from "next/server";
import { z } from "zod";
import { adminAuth } from "@/lib/firebase-admin";
import { HttpError, manejar } from "@/lib/errors";
import { verificarOrigen } from "@/lib/auth";

export const runtime = "nodejs";

export const POST = manejar(async (req) => {
  verificarOrigen(req);
  const { idToken, rol } = z
    .object({ idToken: z.string().min(10), rol: z.enum(["estudiante", "organizador"]) })
    .strict()
    .parse(await req.json());
  const t = await adminAuth.verifyIdToken(idToken).catch(() => {
    throw new HttpError(401, "Token inválido");
  });
  await adminAuth.setCustomUserClaims(t.uid, { rol });
  return new NextResponse(null, { status: 204 });
});