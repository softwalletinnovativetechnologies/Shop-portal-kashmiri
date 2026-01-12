import { useState } from "react";
import "./Shop.css";

const PRODUCTS = [
  {
    id: 1,
    name: "Ornate Jewelry Box",
    price: 99.99,
    category: "Handicrafts",
    image: "/images/handicrafts.png",
  },
  {
    id: 2,
    name: "Luxury Gift Hamper",
    price: 149.99,
    category: "Gift Hampers",
    image: "/images/gifthamper.png",
  },
  {
    id: 3,
    name: "Pink Pashmina Shawl",
    price: 129.99,
    category: "Pashmina Shawls",
    image: "/images/pashmina.png",
  },
  {
    id: 4,
    name: "Assorted Dry Fruits",
    price: 39.99,
    category: "Dry Fruits",
    image: "/images/dryfruits.png",
  },
  {
    id: 5,
    name: "Handcrafted Brass Tray",
    price: 124.99,
    category: "Handicrafts",
    image: "/images/handicrafts.png",
  },
  {
    id: 6,
    name: "Walnut Wood Carving",
    price: 79.99,
    category: "Handicrafts",
    image: "/images/handicrafts.png",
  },
];

export default function Shop() {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popularity");

  let filtered = PRODUCTS.filter((p) =>
    category === "All" ? true : p.category === category
  );

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  return (
    <div className="shop-page">
      {/* HERO */}
      <section className="shop-hero">
        <div className="shop-hero-content">
          <h1>Shop Our Products</h1>
          <p>Authentic Gifts from the Heart of Kashmir</p>
          <button className="btn-primary">Shop Now</button>
        </div>
      </section>

      {/* MAIN */}
      <section className="shop-main">
        {/* SIDEBAR */}
        <aside className="shop-sidebar">
          <h3>Categories</h3>
          {[
            "All",
            "Gift Hampers",
            "Pashmina Shawls",
            "Dry Fruits",
            "Handicrafts",
          ].map((cat) => (
            <button
              key={cat}
              className={category === cat ? "active" : ""}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* PRODUCTS */}
        <div className="shop-products">
          <div className="shop-sort">
            <span>Sort by</span>
            <select onChange={(e) => setSort(e.target.value)}>
              <option value="popularity">Popularity</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          <div className="product-grid">
            {filtered.map((p) => (
              <div className="product-card" key={p.id}>
                <img src={p.image} alt={p.name} />
                <h4>{p.name}</h4>
                <p>${p.price}</p>
                <button className="btn-primary small">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
