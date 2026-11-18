import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, db } from "@/lib/firebase-admin";
import { HttpError } from "@/lib/errors";
import { asignarEstado, puedeInscribirse } from "@/services/inscripcion";
import type { Evento, EventoEntrada } from "@/schemas/evento";

export async function listar(categoria?: string): Promise<Evento[]> {
  const snap = await db.collection("eventos").where("publicado", "==", true)
    .where("inicia", ">=", new Date().toISOString()).orderBy("inicia").limit(50).get();
  const todos = snap.docs.map((d) => ({ slug: d.id, ...d.data() }) as Evento);
  return categoria ? todos.filter((e) => e.categoria === categoria) : todos;
}

export async function obtener(slug: string): Promise<Evento | null> {
  const d = await db.doc(`eventos/${slug}`).get();
  return d.exists ? ({ slug: d.id, ...d.data() } as Evento) : null;
}

export async function crear(uid: string, datos: EventoEntrada) {
  const base = datos.titulo.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const slug = `${base}-${Math.random().toString(36).slice(2, 7)}`;
  await db.doc(`eventos/${slug}`).create({ ...datos, organizadorUid: uid, inscritos: 0, publicado: true });
  return slug;
}

export async function inscribir(slug: string, uid: string) {
  const ref = db.doc(`eventos/${slug}`);
  const insRef = ref.collection("inscripciones").doc(uid);
  return db.runTransaction(async (tx) => {
    const [ev, ins] = await Promise.all([tx.get(ref), tx.get(insRef)]);
    if (!ev.exists) throw new HttpError(404, "Evento no encontrado");
    if (ins.exists) throw new HttpError(409, "Ya estás inscrito");
    const e = ev.data()!;
    if (!puedeInscribirse(e.termina)) throw new HttpError(409, "El evento ya pasó");
    const estado = asignarEstado(e.inscritos, e.cupo);
    tx.create(insRef, { estado, creadaEn: new Date().toISOString() });
    if (estado === "confirmada") tx.update(ref, { inscritos: FieldValue.increment(1) });
    return estado;
  });
}

export async function cancelar(slug: string, uid: string) {
  const ref = db.doc(`eventos/${slug}`);
  const insRef = ref.collection("inscripciones").doc(uid);
  await db.runTransaction(async (tx) => {
    const ins = await tx.get(insRef);
    if (!ins.exists) throw new HttpError(404, "No tienes inscripción");
    const siguiente = await tx.get(ref.collection("inscripciones").where("estado", "==", "espera").orderBy("creadaEn").limit(1));
    tx.delete(insRef);
    if (ins.data()!.estado === "confirmada") {
      if (!siguiente.empty) tx.update(siguiente.docs[0].ref, { estado: "confirmada" });
      else tx.update(ref, { inscritos: FieldValue.increment(-1) });
    }
  });
}

export async function asistentes(slug: string) {
  const snap = await db.collection(`eventos/${slug}/inscripciones`).get();
  return Promise.all(snap.docs.map(async (d) => {
    const u = await adminAuth.getUser(d.id).catch(() => null);
    return { correo: u?.email ?? d.id, estado: d.data().estado as string, creadaEn: d.data().creadaEn as string };
  }));
}
export async function misInscripciones(uid: string) {
  const eventos = await listar();
  if (eventos.length === 0) return [];
  const refs = eventos.map((e) => db.doc(`eventos/${e.slug}/inscripciones/${uid}`));
  const docs = await db.getAll(...refs);
  return eventos.flatMap((e, i) =>
    docs[i].exists ? [{ evento: e, estado: docs[i].data()!.estado as string }] : []
  );
}

export async function organizados(uid: string) {
  const snap = await db.collection("eventos").where("organizadorUid", "==", uid).get();
  return snap.docs
    .map((d) => ({ slug: d.id, ...d.data() }) as Evento)
    .sort((a, b) => a.inicia.localeCompare(b.inicia));
}