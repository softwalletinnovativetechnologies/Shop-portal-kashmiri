const CART_KEY = "cart";

/* ================= SAFE PARSE ================= */
const safeParse = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

/* ================= GET CART ================= */
export const getCart = () => {
  const data = localStorage.getItem(CART_KEY);
  return data ? safeParse(data) : [];
};

/* ================= COUNT ================= */
export const getCartCount = () => {
  return getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
};

/* ================= ADD TO CART ================= */
export const addToCart = (product) => {
  const cart = getCart();
  const index = cart.findIndex((i) => i.id === product.id);

  if (index !== -1) {
    cart[index].quantity = Math.min(Number(cart[index].quantity) + 1, 10);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

/* ================= SET QUANTITY (SAFE) ================= */
export const setQuantity = (id, qty) => {
  const quantity = Math.max(1, Math.min(Number(qty), 10));

  const cart = getCart().map((item) =>
    item.id === id ? { ...item, quantity } : item,
  );

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

/* ================= REMOVE ================= */
export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

/* ================= CLEAR CART ================= */
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cartUpdated"));
};
