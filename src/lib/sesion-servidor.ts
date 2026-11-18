import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

export async function usuarioActual() {
  const c = (await cookies()).get("sesion")?.value;
  if (!c) return null;
  try {
    const t = await adminAuth.verifySessionCookie(c, true);
    return { uid: t.uid, correo: t.email ?? "", rol: (t.rol as string) ?? "estudiante" };
  } catch {
    return null;
  }
}