import { z } from "zod";

export const eventoSchema = z.object({
  titulo: z.string().min(3, "Mínimo 3 caracteres").max(120),
  descripcion: z.string().max(2000),
  lugar: z.string().min(2),
  inicia: z.iso.datetime(),
  termina: z.iso.datetime(),
  cupo: z.number().int().min(1).max(10000),
  categoria: z.string().min(2).max(40),
  imagenUrl: z.url().nullable().default(null),
}).strict().refine((d) => d.termina > d.inicia, { message: "El fin debe ser posterior al inicio", path: ["termina"] });

export type EventoEntrada = z.infer<typeof eventoSchema>;
export type Evento = EventoEntrada & { slug: string; organizadorUid: string; inscritos: number; publicado: boolean };
