import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtener } from "@/repositories/eventos";
import Inscripcion from "@/components/Inscripcion";

type Props = { params: Promise<{ slug: string }> };
const fecha = new Intl.DateTimeFormat("es", { dateStyle: "full", timeStyle: "short" });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = await obtener((await params).slug);
  return e ? { title: e.titulo, description: e.descripcion.slice(0, 150) } : {};
}

export default async function Detalle({ params }: Props) {
  const e = await obtener((await params).slug);
  if (!e) notFound();
  const jsonLd = { "@context": "https://schema.org", "@type": "Event", name: e.titulo, startDate: e.inicia, endDate: e.termina, location: { "@type": "Place", name: e.lugar }, description: e.descripcion };
  return (
    <article className="prosa">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <p className="meta">{e.categoria}</p>
      <h1>{e.titulo}</h1>
      <p><time dateTime={e.inicia}>{fecha.format(new Date(e.inicia))}</time> · {e.lugar}</p>
      <p>{e.descripcion}</p>
      <p className="meta">{e.inscritos} de {e.cupo} cupos ocupados</p>
      <Inscripcion slug={e.slug} titulo={e.titulo} lugar={e.lugar} inicia={e.inicia} termina={e.termina} pasado={new Date(e.termina) < new Date()} />
    </article>
  );
}
