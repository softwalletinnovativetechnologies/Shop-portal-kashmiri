const WISHLIST_KEY = "wishlist";

/* GET WISHLIST */
export const getWishlist = () => {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
};

/* CHECK */
export const isInWishlist = (id) => {
  return getWishlist().some((item) => item.id === id);
};

/* TOGGLE (ADD ↔ REMOVE) */
export const toggleWishlist = (product) => {
  let wishlist = getWishlist();

  if (isInWishlist(product.id)) {
    wishlist = wishlist.filter((item) => item.id !== product.id);
  } else {
    wishlist.push(product);
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));

  // 🔔 notify navbar
  window.dispatchEvent(new Event("wishlistUpdated"));
};

/* REMOVE */
export const removeFromWishlist = (id) => {
  const wishlist = getWishlist().filter((item) => item.id !== id);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));

  window.dispatchEvent(new Event("wishlistUpdated"));
};

/* COUNT */
export const getWishlistCount = () => {
  return getWishlist().length;
};
