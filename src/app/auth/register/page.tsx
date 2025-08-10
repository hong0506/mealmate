//前端在注册成功后，立即调用登录接口，拿到 token 存到 localStorage，然后按角色跳转
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1) 先注册
      const r1 = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d1 = await r1.json();
      if (!r1.ok) {
        alert(d1.message || "注册失败");
        return;
      }

      // 2) 再登录
      const r2 = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d2 = await r2.json();
      if (!r2.ok) {
        alert(d2.message || "登录失败");
        router.push("/auth/login");
        return;
      }

      // 3) 保存 token，并按角色跳转
      const token: string = d2.token;
      localStorage.setItem("token", token);

      let role = "user";
      try {
        const payload = JSON.parse(atob(token.split(".")[1] || ""));
        role = payload?.role || "user";
      } catch {}
      alert("注册并登录成功");
      router.push(role === "admin" ? "/admin/menu" : "/menu");
    } catch (err) {
      alert("网络异常，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">注册</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {submitting ? "提交中…" : "注册"}
        </button>
      </form>
    </div>
  );
}

////前端在注册成功后，跳到登录界面：
// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// // import axios from "axios";

// export default function RegisterPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   //用fetch的写法：
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch("/api/auth/register", {
//       //"/api/auth/register"是相对路径，next和react里面都可以fetch相对路径，如果是跨域，那就需要写成绝对路径
//       //比如：const res = await fetch("http://localhost:3000/api/auth/register
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (res.ok) {
//       alert("注册成功");
//       router.push("/auth/login");
//     } else {
//       const data = await res.json();
//       alert(data.message);
//     }
//   };

//   // import { useRouter } from 'next/navigation'
//   // const router = useRouter()
//   // router.push('/auth/login')
//   // 相当于react的：//
//   // import { useNavigate } from 'react-router-dom'
//   // const navigate = useNavigate()
//   // navigate('/auth/login')

//   //用axios的写法：
//   //   const handleSubmit = async (e: React.FormEvent) => {
//   //     e.preventDefault();
//   //     try {
//   //       const res = await axios.post("/api/auth/register", {
//   //         email,
//   //         password,
//   //       });

//   //       alert("注册成功");
//   //       router.push("/auth/login");
//   //     } catch (err: any) {
//   //       // axios 错误信息在 err.response
//   //       alert(err.response?.data?.message || "注册失败");
//   //     }
//   //   };

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">注册</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//           className="w-full p-2 border rounded"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           注册
//         </button>
//       </form>
//     </div>
//   );
// }
