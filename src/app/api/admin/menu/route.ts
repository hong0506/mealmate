import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getPayloadFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  //下面两行确定登录的是admin还是user其他什么的，如果不是admin，那么/admin/menu的页面就会弹出forbidden的alert，所以要npx prisma studio来到user这个table，找到登录的邮箱去更改user role为admin
  console.log("Authorization:", req.headers.get("authorization"));
  console.log("Payload:", getPayloadFromRequest(req));

  const admin = requireAdmin(req);
  if (!admin)
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const items = await prisma.menuItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const admin = requireAdmin(req);
  if (!admin)
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { name, description, price, imageUrl, available } = await req.json();
  if (!name || typeof price !== "number") {
    return NextResponse.json({ message: "name/price 必填" }, { status: 400 });
  }

  const created = await prisma.menuItem.create({
    data: { name, description, price, imageUrl, available: Boolean(available) },
  });

  return NextResponse.json(created, { status: 201 });
}
