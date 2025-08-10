"use client"; //Next.js 会把这个组件作为 客户端组件 处理，让它在浏览器运行。如果不写 "use client"，Next.js 会把它当成 Server Component 编译，到浏览器时会报错：Error: useState is not supported in Server Components
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  id: number; // menuItemId
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

type CartContextType = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  // 从 localStorage 恢复
  useEffect(() => {
    const raw = localStorage.getItem("mealmate_cart");
    if (raw) setLines(JSON.parse(raw));
  }, []);
  // 持久化
  useEffect(() => {
    localStorage.setItem("mealmate_cart", JSON.stringify(lines));
  }, [lines]);

  const add: CartContextType["add"] = (line, qty = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.id === line.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + qty };
        return next;
      }
      return [...prev, { ...line, quantity: qty }];
    });
  };

  const setQty = (id: number, qty: number) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, quantity: Math.max(1, qty) } : l))
    );
  };

  const remove = (id: number) =>
    setLines((prev) => prev.filter((l) => l.id !== id));
  const clear = () => setLines([]);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.price * l.quantity, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{ lines, add, setQty, remove, clear, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
