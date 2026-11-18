import { describe, expect, it } from "vitest";
import { asignarEstado, primeroEnEspera, puedeInscribirse } from "../src/services/inscripcion";

describe("cupos y lista de espera", () => {
  it("confirma mientras haya cupo y manda a espera cuando se agota", () => {
    expect(asignarEstado(9, 10)).toBe("confirmada");
    expect(asignarEstado(10, 10)).toBe("espera");
  });
  it("no permite inscribirse a eventos pasados", () => {
    expect(puedeInscribirse("2020-01-01T00:00:00Z")).toBe(false);
  });
  it("promueve al primero que entró a la espera", () => {
    const l = [{ id: "b", creadaEn: "2026-01-02" }, { id: "a", creadaEn: "2026-01-01" }];
    expect(primeroEnEspera(l)?.id).toBe("a");
  });
});
