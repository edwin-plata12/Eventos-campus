"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (<><h1>No pudimos cargar la página</h1><p>Revisa tu conexión e inténtalo de nuevo.</p><button onClick={reset}>Reintentar</button></>);
}
