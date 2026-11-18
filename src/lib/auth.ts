import { adminAuth } from "./firebase-admin";
import { HttpError } from "./errors";

export type Usuario = { uid: string; correo: string; rol: string };

export async function requerirUsuario(req: Request): Promise<Usuario> {
  const bearer = req.headers.get("authorization")?.replace(/^Bearer /, "");
  const cookie = req.headers.get("cookie")?.match(/(?:^|; )sesion=([^;]+)/)?.[1];
  try {
    const t = bearer ? await adminAuth.verifyIdToken(bearer) : cookie ? await adminAuth.verifySessionCookie(cookie, true) : null;
    if (!t) throw new Error("sin credenciales");
    return { uid: t.uid, correo: t.email ?? "", rol: (t.rol as string) ?? "estudiante" };
  } catch { throw new HttpError(401, "No autenticado"); }
}

export function verificarOrigen(req: Request) {
  const origen = req.headers.get("origin");
  if (origen && origen !== new URL(req.url).origin) throw new HttpError(403, "Origen no permitido");
}
