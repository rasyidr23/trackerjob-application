import { NextRequest } from "next/server";
import { verifyToken, JwtPayload } from "./jwt";

export function getAuthUser(req: NextRequest): JwtPayload | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
