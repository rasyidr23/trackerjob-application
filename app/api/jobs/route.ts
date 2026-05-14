import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextRequest } from "next/server";

const STATUS_LIST = ["Applied", "Administration", "Interview", "Technical Test", "HR Interview", "Offering", "Accepted", "Rejected"];

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const sort = searchParams.get("sort") ?? "createdAt";
  const order = searchParams.get("order") ?? "desc";
  const skip = (page - 1) * limit;

  const where = {
    userId: user.userId,
    ...(search && {
      OR: [
        { company: { contains: search } },
        { position: { contains: search } },
      ],
    }),
    ...(status && { status }),
  };

  const [jobs, total] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      orderBy: { [sort]: order },
      skip,
      take: limit,
    }),
    prisma.jobApplication.count({ where }),
  ]);

  return NextResponse.json({ jobs, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { company, position, link, appliedAt, status, location, salaryRange, notes, deadline, source } = body;

    if (!company || !position) {
      return NextResponse.json({ error: "Company and position are required" }, { status: 400 });
    }

    if (status && !STATUS_LIST.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const job = await prisma.jobApplication.create({
      data: {
        userId: user.userId,
        company: company.trim(),
        position: position.trim(),
        link: link?.trim() || null,
        appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
        status: status || "Applied",
        location: location?.trim() || null,
        salaryRange: salaryRange?.trim() || null,
        notes: notes?.trim() || null,
        source: source?.trim() || null,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
