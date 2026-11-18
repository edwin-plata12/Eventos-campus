import { usuarioActual } from "@/lib/sesion-servidor";
import { listar, organizados } from "@/repositories/eventos";
import FormEvento from "@/components/FormEvento";

const fecha = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" });

export default async function Home() {
  const u = await usuarioActual();
  const esOrganizador = u?.rol === "organizador";
  const proximos = await listar();
  const propios = u && esOrganizador ? await organizados(u.uid) : [];

  return (
    <>
      <h1>Eventos del campus</h1>

      <h2>Próximos eventos</h2>
      {proximos.length === 0 ? (
        <p>Todavía no hay eventos publicados.</p>
      ) : (
        <ul className="rejilla">
          {proximos.map((e) => (
            <li key={e.slug} className="tarjeta">
              <p className="meta">{e.categoria}</p>
              <h3><a href={`/eventos/${e.slug}`}>{e.titulo}</a></h3>
              <p className="meta">
                <time dateTime={e.inicia}>{fecha.format(new Date(e.inicia))}</time> · {e.lugar}
              </p>
              <p className="meta">{e.inscritos} de {e.cupo} cupos</p>
              <p><a href={`/eventos/${e.slug}`}>Ver detalle e inscribirme</a></p>
            </li>
          ))}
        </ul>
      )}

      {u && !esOrganizador && (
        <p><a href="/mis-eventos">Ver mis inscripciones</a></p>
      )}

      {esOrganizador && (
        <>
          <h2>Crear evento</h2>
          <FormEvento />

          <h2>Mis eventos publicados</h2>
          {propios.length === 0 ? (
            <p>Todavía no has publicado eventos.</p>
          ) : (
            <ul className="rejilla">
              {propios.map((e) => (
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