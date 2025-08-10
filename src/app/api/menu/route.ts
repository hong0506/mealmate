import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// GET /api/menu?search=xxx&available=true
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("search") || "";
  const availableParam = searchParams.get("available");

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (availableParam !== null) {
    where.available = availableParam === "true";
  }

  const items = await prisma.menuItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}
