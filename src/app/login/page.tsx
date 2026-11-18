"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client";

export default function Login() {
  const [error, setError] = useState("");
  async function entrar(formData: FormData) {
    setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, String(formData.get("correo")), String(formData.get("clave")));
      const r = await fetch("/api/auth/sesion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: await cred.user.getIdToken() }) });
      if (!r.ok) throw new Error();
      window.location.href = "/";
    } catch { setError("Correo o contraseña incorrectos."); }
  }
  return (
    <>
      <h1>Iniciar sesión</h1>
      <form action={entrar} className="prosa">
        <p><label>Correo<br /><input name="correo" type="email" autoComplete="email" required /></label></p>
        <p><label>Contraseña<br /><input name="clave" type="password" autoComplete="current-password" required /></label></p>
        <button>Entrar</button>
        <p role="alert" className="error">{error}</p>
      </form>
      <p>¿No tienes cuenta? <a href="/registro">Crear cuenta</a></p>
    </>
  );
}