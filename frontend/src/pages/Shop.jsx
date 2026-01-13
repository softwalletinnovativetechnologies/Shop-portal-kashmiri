import { useState } from "react";
import { Link } from "react-router-dom";
import products from "../data/products";
import "./Shop.css";

export default function Shop() {
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 6;

  const categories = [
    "All",
    "Gift Hampers",
    "Pashmina Shawls",
    "Dry Fruits",
    "Handicrafts",
  ];

  /* ================= FILTER + SORT ================= */
  const filteredProducts = products
    .filter((p) => {
      const categoryMatch = category === "All" || p.category === category;
      const priceMatch = p.price >= minPrice && p.price <= maxPrice;
      return categoryMatch && priceMatch;
    })
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0;
    });

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const changePage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="shop-layout">
      {/* ================= SIDEBAR ================= */}
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
          <h4>Price Range</h4>

          <label>Min: ₹{minPrice}</label>
          <input
            type="range"
            min="500"
            max="6000"
            step="100"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(Number(e.target.value));
              setCurrentPage(1);
            }}
          />

          <label>Max: ₹{maxPrice}</label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-box">
          <h4>Sort by Price</h4>
          <select
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Default</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>
        </div>
      </aside>

      {/* ================= PRODUCTS ================= */}
      <main className="shop-content">
        <h1>Shop Products</h1>

        <div className="shop-grid">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="shop-card"
              >
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">₹{product.price}</p>
              </Link>
            ))
          ) : (
            <p className="no-products">No products found.</p>
          )}
        </div>

        {/* ================= PAGINATION UI ================= */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              ‹ Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => changePage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
            >
              Next ›
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
