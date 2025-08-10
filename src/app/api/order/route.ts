import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayloadFromRequest } from "@/lib/auth";

type OrderItemInput = { menuItemId: number; quantity: number };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = getPayloadFromRequest(req);
    if (!user) {
      console.log("[ORDER][POST] no auth");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      console.error("[ORDER][POST] bad json body");
      return NextResponse.json({ message: "Bad JSON" }, { status: 400 });
    }

    const items =
      (body.items as OrderItemInput[] | undefined)?.filter(
        (i) => i.menuItemId && i.quantity > 0
      ) || [];
    if (items.length === 0) {
      console.log("[ORDER][POST] empty items");
      return NextResponse.json({ message: "No items" }, { status: 400 });
    }

    const menuIds = items.map((i) => i.menuItemId);
    const menu = await prisma.menuItem.findMany({
      where: { id: { in: menuIds } },
    });
    if (menu.length !== items.length) {
      console.warn("[ORDER][POST] some items not found", {
        menuIds,
        found: menu.length,
      });
      return NextResponse.json(
        { message: "Some items not found" },
        { status: 400 }
      );
    }

    let total = 0;
    for (const it of items) {
      const m = menu.find((x) => x.id === it.menuItemId)!;
      if (!m.available) {
        console.warn("[ORDER][POST] item sold out", m.id);
        return NextResponse.json(
          { message: `菜品已售罄：${m.name}` },
          { status: 409 }
        );
      }
      total += m.price * it.quantity;
    }

    const created = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: { userId: user.userId, total },
      });
      await tx.orderItem.createMany({
        data: items.map((i) => ({
          orderId: order.id,
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
      });
      return order;
    });

    return NextResponse.json({ orderId: created.id, total }, { status: 201 });
  } catch (err) {
    console.error("[ORDER][POST] UNHANDLED", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const user = getPayloadFromRequest(req);
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          menuItem: {
            select: { id: true, name: true, price: true, imageUrl: true },
          },
        },
      },
    },
  });

  return NextResponse.json(orders);
}
