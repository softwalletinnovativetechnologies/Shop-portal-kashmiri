import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "./adminCoupons.css";

export default function AdminCoupons() {
  const token = localStorage.getItem("token");

  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: "",
    minOrderAmount: "",
    category: "ALL",
    expiry: "",
  });

  /* ================= FETCH COUPONS ================= */
  useEffect(() => {
    fetch("http://localhost:5001/api/admin/coupons", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCoupons(Array.isArray(data) ? data : []))
      .catch(() => setCoupons([]));
  }, [token]);

  /* ================= CREATE COUPON ================= */
  const createCoupon = async (e) => {
    e.preventDefault();

    if (!form.code || !form.value || !form.expiry) {
      toast.error("Please fill required fields");
      return;
    }

    const payload = {
      ...form,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount || 0),
    };

    const res = await fetch("http://localhost:5001/api/admin/coupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Coupon creation failed");
      return;
    }

    toast.success("Coupon added successfully 🎉");
    setCoupons((prev) => [data, ...prev]);

    setForm({
      code: "",
      type: "PERCENT",
      value: "",
      minOrderAmount: "",
      category: "ALL",
      expiry: "",
    });

    setShowForm(false);
  };

  /* ================= TOGGLE ACTIVE ================= */
  const toggle = async (id) => {
    const res = await fetch(
      `http://localhost:5001/api/admin/coupons/${id}/toggle`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const updated = await res.json();

    setCoupons((prev) => prev.map((c) => (c._id === id ? updated : c)));
  };

  return (
    <div className="admin-page">
      <h1>Coupons</h1>

      {/* ===== ADD COUPON BUTTON ===== */}
      <button className="add-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Coupon Form" : "Add Coupon"}
      </button>

      {/* ===== CREATE FORM ===== */}
      {showForm && (
        <form className="coupon-form" onSubmit={createCoupon}>
          <input
            placeholder="Coupon Code (NEWYEAR50)"
            value={form.code}
            required
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="PERCENT">Percentage (%)</option>
            <option value="FLAT">Flat ₹</option>
          </select>

          <input
            type="number"
            placeholder="Discount Value"
            required
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />

          <input
            type="number"
            placeholder="Min Order Amount"
            value={form.minOrderAmount}
            onChange={(e) =>
              setForm({ ...form, minOrderAmount: e.target.value })
            }
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="ALL">All Categories</option>
            <option value="Pashmina Shawls">Pashmina Shawls</option>
            <option value="Dry Fruits">Dry Fruits</option>
            <option value="Gift Hampers">Gift Hampers</option>
            <option value="Handicrafts">Handicrafts</option>
          </select>

          <input
            type="date"
            required
            value={form.expiry}
            onChange={(e) => setForm({ ...form, expiry: e.target.value })}
          />

          <button type="submit">Create Coupon</button>
        </form>
      )}

      {/* ===== COUPON LIST ===== */}
      <div className="coupon-list">
        {coupons.map((c) => (
          <div className="coupon-card" key={c._id}>
            <strong>{c.code}</strong>
            <p>
              {c.type === "PERCENT" ? `${c.value}% OFF` : `₹${c.value} OFF`}
            </p>
            <p>Category: {c.category}</p>
            <p>Min Order: ₹{c.minOrderAmount}</p>
            <p>Expiry: {new Date(c.expiry).toDateString()}</p>

            <button onClick={() => toggle(c._id)}>
              {c.active ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
