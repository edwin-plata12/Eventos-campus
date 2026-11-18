export type Estado = "confirmada" | "espera";

export const asignarEstado = (inscritos: number, cupo: number): Estado => (inscritos < cupo ? "confirmada" : "espera");
export const puedeInscribirse = (terminaISO: string, ahora = new Date()) => new Date(terminaISO) > ahora;
export const primeroEnEspera = <T extends { creadaEn: string }>(lista: T[]): T | undefined =>
  [...lista].sort((a, b) => a.creadaEn.localeCompare(b.creadaEn))[0];
