import { usuarioActual } from "@/lib/sesion-servidor";
import { organizados } from "@/repositories/eventos";
import FormEvento from "@/components/FormEvento";

const fecha = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" });

export default async function Home() {
  const u = await usuarioActual();
  const eventos = u && u.rol === "organizador" ? await organizados(u.uid) : [];

  return (
    <>
      <h1>Eventos del campus</h1>

      {u && u.rol === "organizador" && (
        <>
          <h2>Crear evento</h2>
          <FormEvento />

          <h2>Mis eventos publicados</h2>
          {eventos.length === 0 ? (
            <p>Todavía no has publicado eventos.</p>
          ) : (
            <ul className="rejilla">
              {eventos.map((e) => (
                <li key={e.slug} className="tarjeta">
                  <h3><a href={`/eventos/${e.slug}`}>{e.titulo}</a></h3>
                  <p className="meta">
                    <time dateTime={e.inicia}>{fecha.format(new Date(e.inicia))}</time>
                  </p>
                  <p className="meta">{e.inscritos} de {e.cupo} cupos</p>
                  <p><a href={`/api/eventos/${e.slug}/asistentes.csv`}>Descargar asistentes (CSV)</a></p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}