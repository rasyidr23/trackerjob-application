import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobs = await prisma.jobApplication.findMany({ where: { userId: user.userId } });

  const statusCounts: Record<string, number> = {
    Applied: 0,
    Administration: 0,
    Interview: 0,
    "Technical Test": 0,
    "HR Interview": 0,
    Offering: 0,
    Accepted: 0,
    Rejected: 0,
  };

  jobs.forEach((job) => {
    if (statusCounts[job.status] !== undefined) {
      statusCounts[job.status]++;
    }
  });

  return NextResponse.json({
    total: jobs.length,
    accepted: statusCounts["Accepted"],
    rejected: statusCounts["Rejected"],
    interview: statusCounts["Interview"],
    administration: statusCounts["Administration"],
    offering: statusCounts["Offering"],
    technicalTest: statusCounts["Technical Test"],
    hrInterview: statusCounts["HR Interview"],
    applied: statusCounts["Applied"],
    statusCounts,
  });
}
