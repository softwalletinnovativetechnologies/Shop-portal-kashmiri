const CART_KEY = "cart";

/* GET CART */
export const getCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

/* SAVE CART */
const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

/* ADD TO CART */
export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
};

/* REMOVE FROM CART */
export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
};

/* UPDATE QUANTITY */
export const updateQuantity = (id, change) => {
  const cart = getCart()
    .map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + change } : item
    )
    .filter((item) => item.quantity > 0);

  saveCart(cart);
};

/* CLEAR CART ✅ (THIS WAS MISSING) */
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cartUpdated"));
};

/* CART COUNT */
export const getCartCount = () => {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
};
