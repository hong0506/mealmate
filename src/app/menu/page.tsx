"use client";

import { useEffect, useState } from "react";
import MenuCard from "@/components/MenuCard";
import Link from "next/link";

type MenuItem = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  available: boolean;
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  async function fetchData() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (onlyAvailable) params.set("available", "true");

    const res = await fetch(`/api/menu?${params.toString()}`, {
      cache: "no-store",
    });
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 首次加载

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="mb-6 text-2xl font-bold">菜单</h1>
        <Link
          href="/cart"
          className="rounded bg-emerald-600 px-4 py-2 text-white"
        >
          去购物车
        </Link>
      </div>
      <form
        onSubmit={onSearch}
        className="mb-6 flex flex-wrap items-center gap-3"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索菜名或描述"
          className="w-64 rounded border p-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          仅看在售
        </label>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          搜索
        </button>
      </form>

      {loading ? (
        <div>加载中...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">暂无菜品</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <MenuCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}
