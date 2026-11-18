"use client";
import { useActionState } from "react";
import { crearIcs } from "@/services/ics";

type Estado = { ok: boolean; mensaje: string };
type Props = { slug: string; titulo: string; lugar: string; inicia: string; termina: string; pasado: boolean };

export default function Inscripcion(p: Props) {
  const [estado, accion, pendiente] = useActionState(async (_: Estado, formData: FormData): Promise<Estado> => {
    const metodo = formData.get("accion") === "cancelar" ? "DELETE" : "POST";
    const r = await fetch(`/api/eventos/${p.slug}/inscripcion`, { method: metodo });
    if (r.status === 401) return { ok: false, mensaje: "Inicia sesión para continuar." };
    if (!r.ok) return { ok: false, mensaje: (await r.json().catch(() => ({}))).error ?? "No se pudo completar." };
    if (metodo === "DELETE") return { ok: true, mensaje: "Inscripción cancelada." };
    const { estado } = await r.json();
    return { ok: true, mensaje: estado === "confirmada" ? "Cupo confirmado." : "Estás en lista de espera." };
  }, { ok: true, mensaje: "" });

  function descargar() {
    const url = URL.createObjectURL(new Blob([crearIcs(p)], { type: "text/calendar" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${p.slug}.ics` });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <form action={accion} className="acciones">
      <button name="accion" value="inscribir" disabled={pendiente || p.pasado}>{p.pasado ? "Evento finalizado" : "Apartar cupo"}</button>
      <button name="accion" value="cancelar" className="secundario" disabled={pendiente}>Cancelar inscripción</button>
      <button type="button" className="secundario" onClick={descargar}>Agregar al calendario</button>
      <p role="status" aria-live="polite" className={estado.ok ? "" : "error"}>{pendiente ? "Procesando…" : estado.mensaje}</p>
    </form>
  );
}
