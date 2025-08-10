import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/bcrypt";
import { generateToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await comparePassword(password, user.password))) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  return NextResponse.json({ token }, { status: 200 });
}
