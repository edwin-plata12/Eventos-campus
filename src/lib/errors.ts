import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(public status: number, message: string, public detalles?: { campo: string; mensaje: string }[]) { super(message); }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function manejar(handler: (req: Request, ctx: any) => Promise<Response>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: Request, ctx: any) => {
    try { return await handler(req, ctx); }
    catch (e) {
      if (e instanceof HttpError) return NextResponse.json({ error: e.message, detalles: e.detalles }, { status: e.status });
      if (e instanceof ZodError) return NextResponse.json({ error: "Datos inválidos", detalles: e.issues.map((i) => ({ campo: i.path.join("."), mensaje: i.message })) }, { status: 400 });
      console.error("Error no controlado");
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
  };
}
