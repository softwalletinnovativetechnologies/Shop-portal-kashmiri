const BASE_URL = "http://localhost:5001/api";

/* ================= GET ALL PRODUCTS ================= */
export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

/* ================= GET PRODUCT BY ID ================= */
export const fetchProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
};
