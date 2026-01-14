/* ================= GET CART ================= */
export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

/* ================= SAVE CART ================= */
const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

/* ================= ADD TO CART ================= */
export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
};

/* ================= UPDATE QUANTITY ================= */
export const updateQuantity = (id, qty) => {
  let cart = getCart();

  if (qty <= 0) {
    cart = cart.filter((item) => item.id !== id);
  } else {
    cart = cart.map((item) => (item.id === id ? { ...item, qty } : item));
  }

  saveCart(cart);
};

/* ================= REMOVE FROM CART ================= */
export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
};

/* ================= CART COUNT ================= */
export const getCartCount = () => {
  return getCart().reduce((total, item) => total + item.qty, 0);
};
