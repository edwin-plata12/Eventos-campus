import { NextResponse } from "next/server";
import { HttpError, manejar } from "@/lib/errors";
import { requerirUsuario, verificarOrigen } from "@/lib/auth";
import { eventoSchema } from "@/schemas/evento";
import { crear, listar } from "@/repositories/eventos";

export const runtime = "nodejs";

export const GET = manejar(async (req) => {
  const categoria = new URL(req.url).searchParams.get("categoria") ?? undefined;
  return NextResponse.json({ items: await listar(categoria), siguienteCursor: null }, { headers: { "Cache-Control": "s-maxage=30" } });
});

export const POST = manejar(async (req) => {
  verificarOrigen(req);
  const u = await requerirUsuario(req);
  if (u.rol !== "organizador") throw new HttpError(403, "Solo organizadores");
  const slug = await crear(u.uid, eventoSchema.parse(await req.json()));
  return NextResponse.json({ slug }, { status: 201 });
});
