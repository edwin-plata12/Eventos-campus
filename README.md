# 25 · Eventos del campus

## Puesta en marcha
1. `npm install`
2. Copia `.env.example` a `.env.local` y complétalo (Firebase Auth Email/Password, Firestore en modo producción, Vercel Blob).
3. Publica `firestore.rules` y `firestore.indexes.json` en tu proyecto Firebase.
4. `npm run dev` · `npm test`

## Roles
El rol de organizador es un custom claim: `adminAuth.setCustomUserClaims(uid, { rol: "organizador" })`.

## Pendiente (según el documento)
Páginas `/mis-eventos` y `/organizador`, subida de imágenes con Vercel Blob, `openapi.yaml`, colección Bruno, más pruebas,
configuración de IA (`ia/`), evidencias de calidad (`calidad/`) y despliegue en Vercel.
