import "./Home.css";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="home">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Authentic Gifts from Kashmir</h1>

          <p className="hero-subtitle">Handcrafted • Premium • Timeless</p>

          <button className="primary-btn">Shop Now</button>
        </div>
      </section>

      <section className="category">
        <h2>Shop by Category</h2>

        <div className="category-grid">
          <div className="category-card gift">
            <span>Gift Hampers</span>
          </div>

          <div className="category-card pashmina">
            <span>Pashmina Shawls</span>
          </div>

          <div className="category-card dryfruit">
            <span>Dry Fruits</span>
          </div>

          <div className="category-card handicraft">
            <span>Handicrafts</span>
          </div>
        </div>
      </section>
      <section className="story-section">
        <div className="story-wrapper">
          {/* LEFT IMAGE */}
          <div className="story-image">
            <img src="/images/story.png" alt="Kashmiri Gifts" />
          </div>

          {/* RIGHT CARD */}
          <div className="story-glass">
            <h2>A Story of Kashmir</h2>
            <p>
              Every gift tells a story of Kashmir's heritage and skilled
              artisans.
            </p>

            <button className="story-btn">Shop Gifts →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
