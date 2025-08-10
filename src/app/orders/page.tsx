"use client";
import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  quantity: number;
  menuItem: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string | null;
  };
};
type Order = {
  id: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("请先登录");
      window.location.href = "/auth/login";
      return;
    }
    (async () => {
      setLoading(true);
      const res = await fetch("/api/order", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json();
      setOrders(res.ok ? data : []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">我的订单</h1>
      {loading ? (
        <div>加载中...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">暂无订单</div>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-semibold">订单号 #{o.id}</div>
                <div className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
              <ul className="divide-y rounded-xl border">
                {o.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.menuItem.imageUrl || ""}
                      alt={it.menuItem.name}
                      className="h-14 w-20 rounded object-cover bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{it.menuItem.name}</div>
                      <div className="text-sm text-gray-500">
                        单价 ${it.menuItem.price.toFixed(2)} × {it.quantity}
                      </div>
                    </div>
                    <div className="w-24 text-right font-semibold">
                      ${(it.menuItem.price * it.quantity).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-right">
                合计：
                <span className="text-lg font-bold">${o.total.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
