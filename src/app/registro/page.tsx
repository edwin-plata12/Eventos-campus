"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client";

export default function Registro() {
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function crear(formData: FormData) {
    setError("");
    setEnviando(true);
    try {
      const rol = String(formData.get("rol"));
      const cred = await createUserWithEmailAndPassword(
        auth,
        String(formData.get("correo")),
        String(formData.get("clave"))
      );
      const cabeceras = { "Content-Type": "application/json" };
      const r1 = await fetch("/api/auth/registro", {
        method: "POST",
        headers: cabeceras,
        body: JSON.stringify({ idToken: await cred.user.getIdToken(), rol }),
      });
      if (!r1.ok) throw new Error("rol");
      const r2 = await fetch("/api/auth/sesion", {
        method: "POST",
        headers: cabeceras,
        body: JSON.stringify({ idToken: await cred.user.getIdToken(true) }),
      });
      if (!r2.ok) throw new Error("sesion");
      window.location.href = "/";
    } catch (e) {
      console.error("Error registro:", e);
      const codigo = (e as { code?: string }).code;
      const detalle = (e as { message?: string }).message;
      if (codigo === "auth/email-already-in-use") setError("Ese correo ya tiene una cuenta.");
      else if (codigo === "auth/weak-password") setError("La contraseña debe tener al menos 6 caracteres.");
      else setError(`No se pudo crear la cuenta (${codigo ?? detalle ?? "desconocido"}).`);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <h1>Crear cuenta</h1>
      <form action={crear} className="prosa">
        <p><label>Correo<br /><input name="correo" type="email" autoComplete="email" required /></label></p>
        <p><label>Contraseña<br /><input name="clave" type="password" autoComplete="new-password" minLength={6} required /></label></p>
        <p>
          <label>Rol<br />
            <select name="rol" defaultValue="estudiante">
              <option value="estudiante">Estudiante</option>
              <option value="organizador">Organizador</option>
            </select>
          </label>
        </p>
        <button disabled={enviando}>{enviando ? "Creando…" : "Crear cuenta"}</button>
        <p role="alert" className="error">{error}</p>
      </form>
      <p>¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>
    </>
  );
}