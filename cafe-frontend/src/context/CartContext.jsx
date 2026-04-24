import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("thirdsip_cart") || "[]");
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("thirdsip_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (coffee, customization) => {
    const key = `${coffee.id}-${JSON.stringify(customization)}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...coffee, qty: 1, customization, key }];
    });
  };

  const removeFromCart = (key) => setCart((prev) => prev.filter((i) => i.key !== key));

  const updateQty = (key, delta) =>
    setCart((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0)
    );

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
