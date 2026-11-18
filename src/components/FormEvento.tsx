"use client";
import { useState } from "react";

const categorias = ["Académico", "Cultural", "Deportivo", "Bienestar"];

export default function FormEvento() {
  const [errores, setErrores] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);

  async function crear(fd: FormData) {
    setErrores([]);
    setEnviando(true);
    try {
      const body = {
        titulo: String(fd.get("titulo")),
        descripcion: String(fd.get("descripcion")),
        lugar: String(fd.get("lugar")),
        categoria: String(fd.get("categoria")),
        cupo: Number(fd.get("cupo")),
        inicia: new Date(String(fd.get("inicia"))).toISOString(),
        termina: new Date(String(fd.get("termina"))).toISOString(),
      };
      const r = await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.status === 201) { window.location.reload(); return; }
      const d = await r.json().catch(() => ({}));
      setErrores(d.detalles?.map((x: { campo: string; mensaje: string }) => `${x.campo}: ${x.mensaje}`) ?? [d.error ?? "No se pudo crear el evento."]);
    } catch {
      setErrores(["Revisa las fechas e inténtalo de nuevo."]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form action={crear} className="prosa">
      <p><label>Título<br /><input name="titulo" required minLength={3} /></label></p>
      <p><label>Descripción<br /><input name="descripcion" required /></label></p>
      <p><label>Lugar<br /><input name="lugar" required /></label></p>
      <p><label>Categoría<br />
        <select name="categoria">{categorias.map((c) => <option key={c}>{c}</option>)}</select>
      </label></p>
      <p><label>Inicia<br /><input name="inicia" type="datetime-local" required /></label></p>
      <p><label>Termina<br /><input name="termina" type="datetime-local" required /></label></p>
      <p><label>Cupo<br /><input name="cupo" type="number" min={1} defaultValue={20} required /></label></p>
      <button disabled={enviando}>{enviando ? "Publicando…" : "Publicar evento"}</button>
      <div role="alert" className="error">{errores.map((e) => <p key={e}>{e}</p>)}</div>
    </form>
  );
}