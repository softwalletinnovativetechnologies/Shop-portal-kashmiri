import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./About.css";

export default function About() {
  const navigate = useNavigate();
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          } else {
            entry.target.classList.remove("active"); // 🔥 repeat animation
          }
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero reveal">
        <div className="about-hero-content">
          <h1 className="reveal delay-1">About Us</h1>
          <p className="reveal delay-2">
            Crafted with Passion in the Heart of Kashmir
          </p>
          <button
            className="primary-btn reveal delay-3"
            onClick={() => navigate("/shop")}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* STORY */}
      <section className="about-story reveal">
        <div className="story-card reveal delay-1">
          <h2>Our Story</h2>
          <p>
            Welcome to Kashmir Gift Store, where the timeless beauty of Kashmir
            is brought to life through our curated collection of handcrafted
            treasures.
          </p>

          <ul>
            <li>Premium gift hampers filled with Kashmiri crafts.</li>
            <li>Luxurious Pashmina shawls.</li>
            <li>Hand-carved walnut wood crafts.</li>
            <li>Valley sourced dry fruits.</li>
          </ul>

          <button className="primary-btn" onClick={() => navigate("/shop")}>
            Shop Now
          </button>
        </div>

        <div className="story-image reveal delay-2">
          <img src="/images/Our-Story.png" alt="Kashmir Craft" />
        </div>
      </section>
    </div>
  );
}
