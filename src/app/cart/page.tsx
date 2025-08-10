"use client";
import { useCart } from "@/components/cart/CartProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { lines, setQty, remove, subtotal, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const router = useRouter();

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("请先登录");
      router.push("/auth/login");
      return;
    }
    if (lines.length === 0) {
      alert("购物车为空");
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: lines.map((l) => ({ menuItemId: l.id, quantity: l.quantity })),
        }),
      });

      // 先拿纯文本，再尝试解析 JSON，避免“空响应”把页面搞挂
      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {}

      if (res.ok && data) {
        clear();
        alert(
          `下单成功，订单号 #${data.orderId}，金额 $${Number(
            data.total
          ).toFixed(2)}`
        );
        router.push(`/orders`);
        // router.push(`/orders/${data.orderId}`);
      } else {
        // 把服务端文本直接展示，便于定位
        alert(
          (data && data.message) || text || `下单失败（HTTP ${res.status}）`
        );
      }
    } catch (e) {
      console.error(e);
      alert("网络异常，请稍后重试");
    } finally {
      setPlacing(false); // 保证按钮状态恢复
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">购物车</h1>

      {lines.length === 0 ? (
        <div className="text-gray-500">你的购物车是空的。</div>
      ) : (
        <>
          <ul className="divide-y rounded-2xl border">
            {lines.map((line) => (
              <li key={line.id} className="flex items-center gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={line.imageUrl || ""}
                  alt={line.name}
                  className="h-16 w-24 rounded object-cover bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{line.name}</div>
                  <div className="text-sm text-gray-500">
                    ${line.price.toFixed(2)} / 份
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="h-8 w-8 rounded border"
                    onClick={() =>
                      setQty(line.id, Math.max(1, line.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="w-14 rounded border p-1 text-center"
                    value={line.quantity}
                    min={1}
                    onChange={(e) =>
                      setQty(line.id, Math.max(1, Number(e.target.value)))
                    }
                  />
                  <button
                    className="h-8 w-8 rounded border"
                    onClick={() => setQty(line.id, line.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="w-24 text-right font-semibold">
                  ${(line.price * line.quantity).toFixed(2)}
                </div>

                <button
                  className="text-red-600 text-sm"
                  onClick={() => remove(line.id)}
                >
                  移除
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-lg">
              小计：<span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <button
              disabled={placing}
              onClick={placeOrder}
              className="rounded-xl bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-60"
            >
              {placing ? "提交中..." : "提交订单"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
