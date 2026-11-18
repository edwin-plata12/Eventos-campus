import { redirect } from "next/navigation";
import { usuarioActual } from "@/lib/sesion-servidor";
import { misInscripciones } from "@/repositories/eventos";

export const metadata = { title: "Mis eventos" };
const fecha = new Intl.DateTimeFormat("es", { dateStyle: "full", timeStyle: "short" });

export default async function MisEventos() {
  const u = await usuarioActual();
  if (!u) redirect("/login");
  const items = await misInscripciones(u.uid);
  return (
    <>
      <h1>Mis eventos</h1>
      {items.length === 0 ? (
        <p>Aún no te has inscrito a ningún evento. <a href="/">Mira la cartelera</a>.</p>
      ) : (
        <ul className="rejilla">
          {items.map(({ evento: e, estado }) => (
            <li key={e.slug} className="tarjeta">
              <p className="meta">{estado === "confirmada" ? "Cupo confirmado" : "En lista de espera"}</p>
              <h2><a href={`/eventos/${e.slug}`}>{e.titulo}</a></h2>
              <p className="meta"><time dateTime={e.inicia}>{fecha.format(new Date(e.inicia))}</time></p>
              <p className="meta">{e.lugar}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}