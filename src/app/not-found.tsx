import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>No encontramos esa página</h1>
      <p><Link href="/">Volver a la cartelera</Link></p>
    </>
  );
}