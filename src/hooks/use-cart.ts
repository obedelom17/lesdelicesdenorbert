import { useCallback, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number; // FCFA
  qty: number;
};

const STORAGE_KEY = "ldn-cart-v1";
const EVENT = "ldn-cart-change";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((item: Omit<CartItem, "qty">) => {
    const current = read();
    const idx = current.findIndex((i) => i.id === item.id);
    if (idx >= 0) current[idx].qty += 1;
    else current.push({ ...item, qty: 1 });
    write(current);
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const current = read();
    const idx = current.findIndex((i) => i.id === id);
    if (idx < 0) return;
    if (qty <= 0) current.splice(idx, 1);
    else current[idx].qty = qty;
    write(current);
  }, []);

  const clear = useCallback(() => write([]), []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return { items, add, remove, setQty, clear, count, total };
}

export function formatFCFA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}
