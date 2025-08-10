"use client";
import { useCart } from "@/components/cart/CartProvider";

type MenuItem = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  available: boolean;
};

export default function MenuCard({ item }: { item: MenuItem }) {
  const { add } = useCart();

  return (
    <div className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100 mb-3">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-sm text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold">${item.price.toFixed(2)}</div>
          <div
            className={`text-xs ${
              item.available ? "text-green-600" : "text-gray-400"
            }`}
          >
            {item.available ? "在售" : "售罄"}
          </div>
        </div>
      </div>

      <button
        disabled={!item.available}
        onClick={() =>
          add(
            {
              id: item.id,
              name: item.name,
              price: item.price,
              imageUrl: item.imageUrl,
            },
            1
          )
        }
        className={`mt-3 w-full rounded-xl px-4 py-2 text-sm font-medium text-white
        ${
          item.available
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        加入购物车
      </button>
    </div>
  );
}
