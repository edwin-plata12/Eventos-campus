const f = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
export function crearIcs(e: { slug: string; titulo: string; lugar: string; inicia: string; termina: string }) {
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Eventos del campus//ES", "BEGIN:VEVENT",
    `UID:${e.slug}@eventos-campus`, `DTSTAMP:${f(new Date().toISOString())}`, `DTSTART:${f(e.inicia)}`, `DTEND:${f(e.termina)}`,
    `SUMMARY:${e.titulo}`, `LOCATION:${e.lugar}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}
