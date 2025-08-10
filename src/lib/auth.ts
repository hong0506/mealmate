import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
// 上面return的值是token，example： eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiZW1haWwiOiJ0ZXN0QGVtYWlsLmNvbSIsImlhdCI6MTY5MjQ2ODAyMCwiZXhwIjoxNjkzMDczODIwfQ.qEzoB
//这个token的结构包含：HEADER.PAYLOAD.SIGNATURE

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
// 如果 token 没有过期，上面return的值是payload，example：{
//   "userId": 123,
//   "email": "test@example.com",
//   "iat": 1692468020,
//   "exp": 1693072820
// }

export function getPayloadFromRequest(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  try {
    return jwt.verify(token, JWT_SECRET) as any; // { userId, email, role, ... }
  } catch {
    return null;
  }
}

export function requireAdmin(req: Request) {
  const p = getPayloadFromRequest(req);
  if (!p || p.role !== "admin") return null;
  return p; // 返回完整 payload
}
