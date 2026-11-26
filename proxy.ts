// Gästetür: nur für Gäste von Marcos gemeinsamer Gästeliste (guest-gate.js).
import { NextResponse, type NextRequest } from "next/server";
import { guestGate } from "./guest-gate.js";

const OPEN = [/^\/(favicon\.(ico|svg)|robots\.txt|manifest\.webmanifest|sw\.js|apple-touch-icon[\w-]*\.png|icon[\w-]*\.png)$/];

export async function proxy(request: NextRequest) {
  const out = await guestGate(request, OPEN);
  if (out.response) return out.response;
  const res = NextResponse.next();
  if (out.cookie) res.headers.append("Set-Cookie", out.cookie);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
