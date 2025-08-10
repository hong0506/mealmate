import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Params = { params: { id: string } };

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: Params) {
  const admin = requireAdmin(req);
  if (!admin)
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const id = Number(params.id);
  const { name, description, price, imageUrl, available } = await req.json();

  const updated = await prisma.menuItem.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
      ...(available !== undefined ? { available: Boolean(available) } : {}),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  const admin = requireAdmin(req);
  if (!admin)
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const id = Number(params.id);
  // 如果担心外键，可先 deleteMany OrderItem where menuItemId=id
  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
