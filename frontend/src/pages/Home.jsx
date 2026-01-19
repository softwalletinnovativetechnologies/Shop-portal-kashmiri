import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const typingRef = useRef(null);
  const footerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    /* ================= SCROLL REVEAL ================= */
    const reveals = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          } else {
            entry.target.classList.remove("active"); // 🔥 repeat animation
          }
        });
      },
      { threshold: 0.2 },
    );

    reveals.forEach((el) => revealObserver.observe(el));

    /* ================= TYPING TEXT (REPEAT ON SCROLL) ================= */
    const typingEl = typingRef.current;

    const typingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && typingEl) {
          typingEl.classList.remove("type-animate");
          void typingEl.offsetWidth; // force reflow
          typingEl.classList.add("type-animate");
        }
      },
      { threshold: 0.6 },
    );

    if (typingEl) typingObserver.observe(typingEl);

    return () => {
      revealObserver.disconnect();
      typingObserver.disconnect();
    };
  }, []);

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home">
      {/* ================= HERO ================= */}
      <section className="hero reveal">
        <div className="hero-content">
          <h1 className="hero-title">
            <span ref={typingRef} className="typing-text type-animate">
              Authentic Gifts
              <br /> from Kashmir
            </span>
          </h1>

          <p className="hero-subtitle reveal delay-1">
            Handcrafted • Premium • Timeless
          </p>

          <button
            className="btn-primary reveal delay-2"
            onClick={() => navigate("/shop")}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* ================= CATEGORY ================= */}
      <section className="category-section">
        <h2 className="section-title reveal">Shop by Category</h2>

        <div className="category-grid">
          <div
            className="category-card reveal delay-1"
            onClick={() => navigate("/shop?category=Gift Hampers")}
          >
            <img src="/images/gifthamper.png" alt="Gift Hampers" />
            <div className="category-overlay">
              <h3>Gift Hampers</h3>
            </div>
          </div>

          <div
            className="category-card reveal delay-2"
            onClick={() => navigate("/shop?category=Pashmina Shawls")}
          >
            <img src="/images/pashmina.png" alt="Pashmina Shawls" />
            <div className="category-overlay">
              <h3>Pashmina Shawls</h3>
            </div>
          </div>

          <div
            className="category-card reveal delay-3"
            onClick={() => navigate("/shop?category=Dry Fruits")}
          >
            <img src="/images/dryfruits.png" alt="Dry Fruits" />
            <div className="category-overlay">
              <h3>Dry Fruits</h3>
            </div>
          </div>

          <div
            className="category-card reveal delay-4"
            onClick={() => navigate("/shop?category=Handicrafts")}
          >
            <img src="/images/handicrafts.png" alt="Handicrafts" />
            <div className="category-overlay">
              <h3>Handicrafts</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="story reveal">
        <div className="story-box">
          <div className="story-image slide-left">
            <img src="/images/story.png" alt="Story of Kashmir" />
          </div>

          <div className="story-content slide-right">
            <h2>A Story of Kashmir</h2>
            <p>
              Every gift tells a story of Kashmir’s heritage and the skilled
              artisans behind it.
            </p>

            <button className="btn-primary" onClick={() => navigate("/about")}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="why reveal">
        <h2 className="reveal">Why Choose Us</h2>
        <p className="why-sub reveal delay-1">
          Crafted luxury from the heart of Kashmir
        </p>

        <div className="why-grid">
          <div className="why-card reveal delay-1">
            <span>🌿</span>
            <h3>Authentic Craftsmanship</h3>
            <p>Directly sourced from skilled Kashmiri artisans.</p>
          </div>

          <div className="why-card reveal delay-2">
            <span>🎁</span>
            <h3>Premium Packaging</h3>
            <p>Luxury packaging designed for every occasion.</p>
          </div>

          <div className="why-card reveal delay-3">
            <span>🚚</span>
            <h3>Secure Delivery</h3>
            <p>Safe & timely delivery across India.</p>
          </div>

          <div className="why-card reveal delay-4">
            <span>⭐</span>
            <h3>Trusted Quality</h3>
            <p>Carefully curated premium handcrafted items.</p>
          </div>
        </div>

        <div className="subscribe reveal delay-3">
          <input type="email" placeholder="Enter your email address" />
          <button className="btn-primary">Subscribe</button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer" ref={footerRef} id="contact">
        <div className="footer-container">
          <div className="footer-links">
            <span onClick={() => navigate("/about")}>About Us</span>
            <span onClick={() => navigate("/shop")}>Shop</span>
            <span onClick={scrollToFooter}>Contact</span>
          </div>

          <div className="footer-logo">
            <img src="/images/logofooter.png" alt="Kashmir Logo" />
          </div>

          <div className="footer-right">
            <span onClick={() => navigate("/privacy-policy")}>
              Privacy Policy
            </span>

            <div className="footer-socials">
              <a
                href="https://wa.me/919596393658"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>

              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <p className="footer-copy">
          © 2024 Kashmir Gift Store. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
