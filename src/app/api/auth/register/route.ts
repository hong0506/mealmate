// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { hashPassword } from "@/lib/bcrypt";

// export async function POST(req: Request) {
//   const { email, password } = await req.json();

//   if (!email || !password) {
//     return NextResponse.json(
//       { message: "Missing email or password" },
//       { status: 400 }
//     );
//   }

//   const existing = await prisma.user.findUnique({ where: { email } });

//   if (existing) {
//     return NextResponse.json(
//       { message: "User already exists" },
//       { status: 409 }
//     );
//   }

//   const hashed = await hashPassword(password);

//   const user = await prisma.user.create({
//     data: { email, password: hashed },
//   });

//   return NextResponse.json(
//     { message: "User registered", userId: user.id },
//     { status: 201 }
//   );
// }

// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/bcrypt";
import { generateToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    );

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, password: hashed } });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  return NextResponse.json({ token }, { status: 201 });
}
