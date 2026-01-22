import { useLocation, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { fetchProducts } from "../api/api";
import "./Shop.css";

const PRODUCTS_PER_PAGE = 9;

export default function Shop() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const searchQuery =
    new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  /* ================= CATEGORY FROM URL ================= */
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategory(cat);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const categories = [
    "All",
    "Gift Hampers",
    "Pashmina Shawls",
    "Dry Fruits",
    "Handicrafts",
  ];

  /* ================= FILTER LOGIC ================= */
  let filtered = products.filter((p) => {
    const name = p.name?.toLowerCase() || "";
    const cat = p.category?.toLowerCase() || "";
    const desc = p.description?.toLowerCase() || "";
    const price = Number(p.price) || 0;

    // 🔍 SEARCH MAPPING
    if (searchQuery) {
      if (
        searchQuery.includes("shawl") ||
        searchQuery.includes("Pashmina Shawls")
      )
        return cat.includes("shawl");

      if (searchQuery.includes("dry") || searchQuery.includes("Dry Fruits"))
        return cat.includes("dry");

      if (
        searchQuery.includes("hamper") ||
        searchQuery.includes("Gift Hampers")
      )
        return cat.includes("hamper");

      if (searchQuery.includes("handicraft"))
        return cat.includes("Handicrafts");

      return (
        name.includes(searchQuery) ||
        cat.includes(searchQuery) ||
        desc.includes(searchQuery)
      );
    }

    return true;
  });

  // 📦 CATEGORY FILTER
  if (category !== "All") {
    filtered = filtered.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase(),
    );
  }

  // 💰 PRICE FILTER
  filtered = filtered.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  // 🔃 SORT
  if (sortOrder === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filtered.slice(start, start + PRODUCTS_PER_PAGE);

  return (
    <div className="shop-page">
      <Breadcrumbs />

      <div className="shop-layout">
        {/* SIDEBAR */}
        <aside className="shop-sidebar">
          <h3>Filters</h3>

          <div className="filter-box">
            <h4>Category</h4>
            {categories.map((cat) => (
              <button
                key={cat}
                className={category === cat ? "active" : ""}
                onClick={() => {
                  setCategory(cat);
                  setCurrentPage(1);
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="filter-box">
            <h4>Price</h4>
            <label>Min ₹{minPrice}</label>
            <input
              type="range"
              min="0"
              max="6000"
              value={minPrice}
              onChange={(e) => setMinPrice(+e.target.value)}
            />

            <label>Max ₹{maxPrice}</label>
            <input
              type="range"
              min="0"
              max="100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)}
            />
          </div>

          <div className="filter-box">
            <h4>Sort</h4>
            <select onChange={(e) => setSortOrder(e.target.value)}>
              <option value="">Default</option>
              <option value="low">Low → High</option>
              <option value="high">High → Low</option>
            </select>
          </div>
        </aside>

        {/* PRODUCTS */}
        <main className="shop-content">
          <div className="shop-grid">
            {paginatedProducts.map((p) => (
              <Link to={`/product/${p.id}`} key={p.id} className="shop-card">
                <div className="card-img">
                  <img src={p.image} alt={p.name} />
                </div>
                <div className="card-info">
                  <h3>{p.name}</h3>
                  <p className="price">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ‹ Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next ›
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
