import { useState } from "react";
import { toast } from "react-hot-toast";
import "./Contact.css";

export default function Contact() {
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to send a query");
      return;
    }

    if (!query.trim()) {
      toast.error("Query cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5001/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email: emailAddress,
          query,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to send query");
        return;
      }

      toast.success("Query sent successfully");
      setName("");
      setEmailAddress("");
      setQuery("");
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>

      {/* INFO CARD */}
      <div className="contact-info-wrapper">
        <div className="contact-info">
          <h3>Customer Support</h3>
          <p>📧 support@kashmirigifts.com</p>
          <p>📞 +91 75997 41491</p>
          <p>📍 Kashmir, India</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="contact-container">
        {/* FORM */}
        <form onSubmit={submit} className="contact-form">
          <h3>Send us a message</h3>

          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            placeholder="Email Address"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
          />

          <textarea
            placeholder="Enter your query here"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* MAP */}
        <div className="contact-map">
          <iframe
            title="Kashmir Location"
            src="https://www.google.com/maps?q=Kashmir%2C%20India&output=embed"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
