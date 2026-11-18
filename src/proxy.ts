import { NextResponse, type NextRequest } from "next/server";

// Solo mejora la experiencia: la seguridad real se verifica en cada ruta de la API.
export function proxy(req: NextRequest) {
  if (!req.cookies.has("sesion")) return NextResponse.redirect(new URL("/login", req.url));
}
export const config = { matcher: ["/mis-eventos/:path*", "/organizador/:path*"] };
