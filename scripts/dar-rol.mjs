import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const correo = process.argv[2];
if (!correo) {
  console.log("Uso: node --env-file=.env.local scripts/dar-rol.mjs correo@ejemplo.com");
  process.exit(1);
}
const u = await getAuth().getUserByEmail(correo);
await getAuth().setCustomUserClaims(u.uid, { rol: "organizador" });
console.log("Listo:", correo, "ahora es organizador. Cierra sesión y entra de nuevo.");