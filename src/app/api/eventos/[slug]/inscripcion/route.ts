import { NextResponse } from "next/server";
import { manejar } from "@/lib/errors";
import { requerirUsuario, verificarOrigen } from "@/lib/auth";
import { cancelar, inscribir } from "@/repositories/eventos";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ slug: string }> };

export const POST = manejar(async (req, ctx: Ctx) => {
  verificarOrigen(req);
  const u = await requerirUsuario(req);
  const { slug } = await ctx.params;
  return NextResponse.json({ estado: await inscribir(slug, u.uid) }, { status: 201 });
});

export const DELETE = manejar(async (req, ctx: Ctx) => {
  verificarOrigen(req);
  const u = await requerirUsuario(req);
  const { slug } = await ctx.params;
  await cancelar(slug, u.uid);
  return new NextResponse(null, { status: 204 });
});
