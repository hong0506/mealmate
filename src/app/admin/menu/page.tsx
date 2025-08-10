"use client";
import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  available: boolean;
};

export default function AdminMenuPage() {
  const [list, setList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 表单
  const [form, setForm] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    available: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchList = async () => {
    if (!token) {
      alert("请先以管理员身份登录");
      window.location.href = "/auth/login";
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/menu", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "无权访问");
      window.location.href = "/auth/login";
      return;
    }
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || typeof form.price !== "number") {
      alert("请填写名称与价格");
      return;
    }
    const url = editingId ? `/api/admin/menu/${editingId}` : "/api/admin/menu";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        imageUrl: form.imageUrl,
        available: Boolean(form.available),
      }),
    });
    if (res.ok) {
      setForm({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        available: true,
      });
      setEditingId(null);
      fetchList();
    } else {
      const data = await res.json();
      alert(data.message || "保存失败");
    }
  };

  const onEdit = (m: MenuItem) => {
    setEditingId(m.id);
    setForm(m);
  };

  const onDelete = async (id: number) => {
    if (!confirm("确认删除该菜品？")) return;
    const res = await fetch(`/api/admin/menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchList();
    else alert("删除失败");
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">菜单管理</h1>
      </div>

      {/* 表单 */}
      <div className="mb-8 rounded-2xl border p-4">
        <h2 className="mb-3 font-semibold">
          {editingId ? "编辑菜品" : "新增菜品"}
        </h2>
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
          <input
            className="rounded border p-2"
            placeholder="名称"
            value={form.name || ""}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            required
          />
          <input
            className="rounded border p-2"
            placeholder="价格"
            type="number"
            step="0.01"
            value={form.price ?? 0}
            onChange={(e) =>
              setForm((s) => ({ ...s, price: Number(e.target.value) }))
            }
            required
          />
          <input
            className="rounded border p-2 sm:col-span-2"
            placeholder="图片 URL"
            value={form.imageUrl || ""}
            onChange={(e) =>
              setForm((s) => ({ ...s, imageUrl: e.target.value }))
            }
          />
          <textarea
            className="rounded border p-2 sm:col-span-2"
            placeholder="描述"
            value={form.description || ""}
            onChange={(e) =>
              setForm((s) => ({ ...s, description: e.target.value }))
            }
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.available}
              onChange={(e) =>
                setForm((s) => ({ ...s, available: e.target.checked }))
              }
            />
            在售
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {editingId ? "保存修改" : "创建"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    name: "",
                    description: "",
                    price: 0,
                    imageUrl: "",
                    available: true,
                  });
                }}
                className="ml-3 rounded border px-4 py-2"
              >
                取消编辑
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 列表 */}
      {loading ? (
        <div>加载中…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => (
            <div key={m.id} className="rounded-2xl border p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.imageUrl || ""}
                alt={m.name}
                className="mb-3 h-40 w-full rounded object-cover bg-gray-100"
              />
              <div className="mb-1 flex items-center justify-between">
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm font-bold">${m.price.toFixed(2)}</div>
              </div>
              <div className="mb-2 text-sm text-gray-600 line-clamp-2">
                {m.description}
              </div>
              <div
                className={`mb-3 text-xs ${
                  m.available ? "text-green-600" : "text-gray-400"
                }`}
              >
                {m.available ? "在售" : "售罄"}
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded border px-3 py-1"
                  onClick={() => onEdit(m)}
                >
                  编辑
                </button>
                <button
                  className="rounded bg-red-600 px-3 py-1 text-white"
                  onClick={() => onDelete(m.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
