const WISHLIST_KEY = "wishlist";

export const getWishlist = () => {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
};

export const getWishlistCount = () => {
  return getWishlist().length;
};

export const isInWishlist = (id) => {
  return getWishlist().some((item) => item.id === id);
};

export const toggleWishlist = (product) => {
  let wishlist = getWishlist();

  if (isInWishlist(product.id)) {
    wishlist = wishlist.filter((item) => item.id !== product.id);
  } else {
    wishlist.push(product);
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const removeFromWishlist = (id) => {
  const wishlist = getWishlist().filter((item) => item.id !== id);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  window.dispatchEvent(new Event("wishlistUpdated"));
};
