import { NextResponse } from "next/server";
import { manejar } from "@/lib/errors";
import { requerirUsuario } from "@/lib/auth";

export const runtime = "nodejs";
export const GET = manejar(async (req) => {
  const usuario = await requerirUsuario(req);
  return NextResponse.json({ usuario }, { headers: { "Cache-Control": "no-store" } });
});
