import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const job = await prisma.jobApplication.findFirst({ where: { id, userId: user.userId } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(job);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.jobApplication.findFirst({ where: { id, userId: user.userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const { company, position, link, appliedAt, status, location, salaryRange, notes, deadline, source } = body;

    const job = await prisma.jobApplication.update({
      where: { id },
      data: {
        company: company?.trim(),
        position: position?.trim(),
        link: link?.trim() || null,
        appliedAt: appliedAt ? new Date(appliedAt) : undefined,
        status,
        location: location?.trim() || null,
        salaryRange: salaryRange?.trim() || null,
        notes: notes?.trim() || null,
        source: source?.trim() || null,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.jobApplication.findFirst({ where: { id, userId: user.userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.jobApplication.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
