"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "登录失败");
        return;
      }

      const token: string = data.token;
      // 关键：持久化 token，给 /admin/menu、下单接口等使用
      localStorage.setItem("token", token);

      // 可选：解析 JWT，按角色跳转（需要后端把 role 放进 token）
      let role = "user";
      try {
        const payload = JSON.parse(atob(token.split(".")[1] || ""));
        role = payload?.role || "user";
      } catch {
        // 解析失败就按普通用户处理
      }

      alert("登录成功");
      if (role === "admin") {
        router.push("/admin/menu");
      } else {
        router.push("/menu");
      }
    } catch (err) {
      alert("网络异常，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">登录</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {submitting ? "登录中..." : "登录"}
        </button>
      </form>
    </div>
  );
}
