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
    cart.push({
      ...product,
      price: Number(product.price),
      quantity: 1,
    });
  }

  saveCart(cart);
};

/* UPDATE QUANTITY */
export const updateQuantity = (id, qty) => {
  let cart = getCart();

  cart = cart.map((item) =>
    item.id === id ? { ...item, quantity: qty } : item
  );

  cart = cart.filter((item) => item.quantity > 0); // auto remove

  saveCart(cart);
};

/* REMOVE ITEM */
export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
};

/* CART COUNT */
export const getCartCount = () => {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
};

/* CART TOTAL */
export const getCartTotal = () => {
  return getCart().reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
};
