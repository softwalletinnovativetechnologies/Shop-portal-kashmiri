import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import "./Shop.css";

const PRODUCTS_PER_PAGE = 9;

export default function Shop() {
    const [products, setProducts] = useState([]);
useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
      .catch((err) => console.error(err));
  }, []);
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams] = useSearchParams();

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

  // ✅ PAGINATION LOGIC
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  return (
    <div className="shop-page">
      <Breadcrumbs />

      <div className="shop-layout">
        {/* ===== SIDEBAR ===== */}
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
            <label>Min ₹{minPrice}</label>
            <input
              type="range"
              min="0"
              max="6000"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(+e.target.value);
                setCurrentPage(1);
              }}
            />

            <label>Max ₹{maxPrice}</label>
            <input
              type="range"
              min="0"
              max="100000"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(+e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="filter-box">
            <h4>Sort</h4>
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

        {/* ===== PRODUCTS ===== */}
        <main className="shop-content">
          <div className="shop-grid">
            {paginatedProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="shop-card"
              >
                <div className="card-img">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="card-info">
                  <h3>{product.name}</h3>
                  <p className="price">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* ===== PAGINATION UI ===== */}
          {totalPages > 1 && (
            <div className="pagination">
              {/* PREV */}
              <button
                className="nav-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ‹ Prev
              </button>

              {/* PAGE NUMBERS */}
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              {/* NEXT */}
              <button
                className="nav-btn"
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
