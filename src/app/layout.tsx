import type { Metadata } from "next";
import "./globals.css";
import SesionNav from "@/components/SesionNav";

export const metadata: Metadata = {
  title: { default: "Eventos del campus", template: "%s · Eventos del campus" },
  description: "Cartelera de eventos universitarios con cupos y calendario.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a className="saltar" href="#contenido">Saltar al contenido</a>
        <header>
          <strong>Eventos del campus</strong>
          <nav aria-label="Principal">
            <ul>
              <li><a href="/">Cartelera</a></li>
              <li><a href="/mis-eventos">Mis eventos</a></li>
              <li><a href="/organizador">Organizador</a></li>
              <SesionNav />
            </ul>
          </nav>
        </header>
        <main id="contenido">{children}</main>
        <footer><p>Proyecto académico · Next.js, Firebase y Vercel</p></footer>
      </body>
    </html>
  );
}