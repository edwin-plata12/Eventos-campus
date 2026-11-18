import { HttpError, manejar } from "@/lib/errors";
import { requerirUsuario } from "@/lib/auth";
import { asistentes, obtener } from "@/repositories/eventos";

export const runtime = "nodejs";

export const GET = manejar(async (req, ctx: { params: Promise<{ slug: string }> }) => {
  const u = await requerirUsuario(req);
  const { slug } = await ctx.params;
  const e = await obtener(slug);
  if (!e) throw new HttpError(404, "Evento no encontrado");
  if (e.organizadorUid !== u.uid) throw new HttpError(403, "No eres el organizador");
  const celda = (v: string) => `"${(/^[=+\-@]/.test(v) ? "'" + v : v).replace(/"/g, '""')}"`;
  const filas = (await asistentes(slug)).map((a) => [a.correo, a.estado, a.creadaEn].map(celda).join(","));
  return new Response(["correo,estado,inscrito_en", ...filas].join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${slug}.csv"`, "Cache-Control": "no-store" },
  });
});
