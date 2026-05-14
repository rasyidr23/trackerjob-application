import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(dbUser);
}
