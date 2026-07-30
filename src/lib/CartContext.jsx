import React, { createContext, useContext, useEffect, useState } from "react";
import { VAT_RATE } from "@/lib/company";

const CartContext = createContext(null);
const KEY = "hjc_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item, message) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.sku === item.sku);
      if (i === -1) return [...prev, item];
      const next = [...prev];
      next[i] = { ...next[i], quantity: next[i].quantity + item.quantity };
      return next;
    });
    setAnnouncement(message || "");
  };

  const updateQuantity = (sku, quantity) =>
    setItems((prev) => prev.map((p) => (p.sku === sku ? { ...p, quantity: Math.max(1, quantity) } : p)));
  const removeItem = (sku) => setItems((prev) => prev.filter((p) => p.sku !== sku));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const totalInclVat = items.reduce((s, i) => s + i.unit_price_incl_vat * i.quantity, 0);
  const totalExclVat = totalInclVat / (1 + VAT_RATE);
  const vatAmount = totalInclVat - totalExclVat;

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clear, count, totalInclVat, totalExclVat, vatAmount, announcement }}
    >
      {children}
      <div aria-live="polite" className="sr-only">{announcement}</div>
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}