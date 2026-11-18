"use client";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase-client";

export default function SesionNav() {
  const [correo, setCorreo] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/auth/yo")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setCorreo(d?.usuario?.correo ?? null))
      .catch(() => setCorreo(null));
  }, []);

  async function salir() {
    await fetch("/api/auth/sesion", { method: "DELETE" });
    await signOut(auth).catch(() => {});
    window.location.href = "/";
  }

  if (correo === undefined) return null;

  return correo ? (
    <>
      <li><span className="meta">{correo}</span></li>
      <li><button type="button" className="secundario" onClick={salir}>Cerrar sesión</button></li>
    </>
  ) : (
    <li><a href="/login">Iniciar sesión</a></li>
  );
}