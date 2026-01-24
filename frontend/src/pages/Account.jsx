import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "./Checkout.css";

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function Checkout() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }

  /* ================= STATES ================= */
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [payment, setPayment] = useState("COD");

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    countryCode: "+91",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* ================= LOAD CART ================= */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    const safe = data.map((i) => ({
      ...i,
      price: Number(i.price || i.product?.price || 0),
      quantity: Number(i.quantity || 1),
    }));
    setCart(safe);
  }, []);

  /* ================= FETCH AVAILABLE COUPONS ================= */
  useEffect(() => {
    fetch("http://localhost:5001/api/coupons/available", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAvailableCoupons(data || []))
      .catch(() => setAvailableCoupons([]));
  }, [token]);

  /* ================= TOTALS ================= */
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const safeDiscount = Math.min(discount, subtotal);
  const finalAmount = Math.max(subtotal - safeDiscount, 0);

  /* ================= APPLY COUPON ================= */
  const applyCoupon = async (code) => {
    const finalCode = code || couponCode;
    if (!finalCode) return toast.error("Enter coupon code");

    try {
      const categories = cart.map((i) => i.category);

      const res = await fetch("http://localhost:5001/api/coupons/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: finalCode,
          cartTotal: subtotal,
          categories,
        }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      setDiscount(Math.min(data.discount, subtotal));
      setAppliedCoupon(finalCode);
      toast.success(`Coupon ${finalCode} applied 🎉`);
    } catch {
      toast.error("Coupon failed");
    }
  };

  /* ================= LOAD ADDRESSES ================= */
  useEffect(() => {
    fetch("http://localhost:5001/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data.addresses || []);
        const def = data.addresses?.find((a) => a.isDefault);
        setSelectedAddress(def || data.addresses?.[0] || null);
      });
  }, [token]);

  /* ================= ADD ADDRESS ================= */
  const addNewAddress = async () => {
    const { name, phone, address, city, state, pincode } = newAddress;
    if (!name || !phone || !address || !city || !state || !pincode) {
      return toast.error("Fill all address fields");
    }

    const updated = [...addresses, newAddress];
    await fetch("http://localhost:5001/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ addresses: updated }),
    });

    setAddresses(updated);
    setShowForm(false);
    toast.success("Address added");
  };

  /* ================= RAZORPAY ================= */
  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /* ================= FINALIZE ORDER ================= */
  const finalizeOrder = async (method, status) => {
    setLoading(true);
    const res = await fetch("http://localhost:5001/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart,
        address: selectedAddress,
        paymentMethod: method,
        paymentStatus: status,
        coupon: appliedCoupon,
        discount: safeDiscount,
      }),
    });
    setLoading(false);

    if (!res.ok) return toast.error("Order failed");

    localStorage.removeItem("cart");
    const data = await res.json();
    window.location.href = `/order-success/${data._id}`;
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    if (!selectedAddress) return toast.error("Select delivery address");

    if (payment === "ONLINE") {
      const ok = await loadRazorpay();
      if (!ok) return toast.error("Razorpay failed");

      const res = await fetch("http://localhost:5001/api/orders/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: finalAmount * 100 }),
      });

      const order = await res.json();

      new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Kashmiri Gifts",
        handler: () => finalizeOrder("ONLINE", "PAID"),
      }).open();

      return;
    }

    finalizeOrder("COD", "PENDING");
  };

  /* ================= JSX ================= */
  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        <div>
          <div className="checkout-card">
            <h2>Delivery Address</h2>

            {addresses.map((a, i) => (
              <div
                key={i}
                className={`address-tile ${selectedAddress === a ? "active" : ""}`}
                onClick={() => setSelectedAddress(a)}
              >
                <input type="radio" checked={selectedAddress === a} readOnly />
                <div>
                  <strong>{a.name}</strong>
                  <p>{a.address}</p>
                  <p>
                    {a.city}, {a.state} - {a.pincode}
                  </p>
                  <small>
                    {a.countryCode} {a.phone}
                  </small>
                </div>
              </div>
            ))}

            <button
              className="add-address-btn"
              onClick={() => setShowForm(!showForm)}
            >
              + Add New Address
            </button>

            {showForm && (
              <div className="new-address-card">
                <input
                  placeholder="Name"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, name: e.target.value })
                  }
                />
                <input
                  placeholder="Address"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                />
                <input
                  placeholder="City"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                <select
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                >
                  <option value="">Select State</option>
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <input
                  placeholder="Pincode"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pincode: e.target.value })
                  }
                />
                <input
                  placeholder="Phone"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                />
                <button onClick={addNewAddress}>Save</button>
              </div>
            )}
          </div>

          <div className="checkout-card">
            <h2>Payment Method</h2>

            <label className="payment-row">
              <input
                type="radio"
                checked={payment === "COD"}
                onChange={() => setPayment("COD")}
              />
              Cash on Delivery
            </label>

            <label className="payment-row">
              <input
                type="radio"
                checked={payment === "ONLINE"}
                onChange={() => setPayment("ONLINE")}
              />
              Online Payment
            </label>

            <button
              className="place-order"
              onClick={placeOrder}
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay ₹${finalAmount}`}
            </button>
          </div>
        </div>

        <aside className="order-summary">
          <h2>Apply Coupon</h2>

          {/* AVAILABLE COUPONS ✅ */}
          {availableCoupons.map((c) => (
            <div key={c._id} className="coupon-item">
              <div>
                <strong>{c.code}</strong>
                <p>
                  {c.type === "PERCENT" ? `${c.value}% off` : `₹${c.value} off`}{" "}
                  • Min ₹{c.minOrderAmount}
                </p>
              </div>
              <button onClick={() => applyCoupon(c.code)}>Apply</button>
            </div>
          ))}

          <div className="coupon-box">
            <input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <button onClick={() => applyCoupon()}>Apply</button>
          </div>

          <h2>Order Summary</h2>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          {safeDiscount > 0 && (
            <div className="summary-line discount">
              <span>Coupon Discount</span>
              <span>-₹{safeDiscount}</span>
            </div>
          )}

          <div className="summary-total">
            <span>Total Payable</span>
            <span>₹{finalAmount}</span>
          </div>
          <button
            className="place-order"
            onClick={placeOrder}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay ₹${finalAmount}`}
          </button>
        </aside>
      </div>
    </div>
  );
}
