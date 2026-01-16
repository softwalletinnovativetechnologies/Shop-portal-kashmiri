const CART_KEY = "cart";

/* ================= GET CART ================= */
export const getCart = () => {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
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
    cart[index].quantity = Number(cart[index].quantity) + 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

/* ================= SET QUANTITY (SAFE) ================= */
export const setQuantity = (id, qty) => {
  let cart = getCart()
    .map((item) => (item.id === id ? { ...item, quantity: Number(qty) } : item))
    .filter((item) => item.quantity > 0);

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
