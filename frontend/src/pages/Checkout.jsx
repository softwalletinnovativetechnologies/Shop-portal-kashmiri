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

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [payment, setPayment] = useState("COD");

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
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
    const safeCart = data.map((item) => ({
      ...item,
      price: Number(item.price || item.product?.price || 0),
      quantity: Number(item.quantity || 1),
    }));
    setCart(safeCart);
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_calling_code) {
          setNewAddress((prev) => ({
            ...prev,
            countryCode: data.country_calling_code,
          }));
        }
      })
      .catch(() => {
        // fallback India
        setNewAddress((prev) => ({ ...prev, countryCode: "+91" }));
      });
  }, []);

  /* ================= SAFE TOTAL ================= */
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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
      })
      .catch(() => toast.error("Failed to fetch addresses"));
  }, [token]);

  /* ================= QTY UPDATE (NO RELOAD) ================= */
  const updateQty = (index, change) => {
    const updated = [...cart];
    updated[index].quantity = Math.max(1, updated[index].quantity + change);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  /* ================= LOAD RAZORPAY ================= */
  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /* ================= SAVE ORDER ================= */
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
      }),
    });
    setLoading(false);

    if (!res.ok) {
      toast.error("Order failed");
      return;
    }

    localStorage.removeItem("cart");
    toast.success("Order placed successfully 🎉");
    const data = await res.json();
    window.location.href = `/order-success/${data._id}`;
  };

  /* ================= ADD ADDRESS ================= */
  const addNewAddress = async () => {
    const { name, phone, address, city, state, pincode } = newAddress;
    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error("Fill all address fields");
      return;
    }

    const updated = [
      ...addresses,
      { ...newAddress, isDefault: addresses.length === 0 },
    ];

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

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    if (!selectedAddress) return toast.error("Select delivery address");
    if (!cart.length) return toast.error("Cart is empty");

    // ONLINE PAYMENT
    if (payment === "ONLINE") {
      const loaded = await loadRazorpay();
      if (!loaded) return toast.error("Razorpay SDK failed");

      const res = await fetch("http://localhost:5001/api/orders/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: subtotal * 100 }),
      });

      const order = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Kashmiri Gifts",
        handler: () => finalizeOrder("ONLINE", "PAID"),
      };

      new window.Razorpay(options).open();
      return;
    }

    // COD
    finalizeOrder("COD", "PENDING");
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        {/* LEFT */}
        <div>
          <div className="checkout-card">
            <h2>Delivery Address</h2>

            {addresses.map((a, i) => (
              <div
                key={i}
                className={`address-tile ${
                  selectedAddress === a ? "active" : ""
                }`}
                onClick={() => setSelectedAddress(a)}
              >
                <input type="radio" checked={selectedAddress === a} readOnly />
                <div className="address-text">
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
                  placeholder="Full Name"
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
                <div className="phone-row">
                  <input value={newAddress.countryCode} disabled />

                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, phone: e.target.value })
                    }
                  />
                </div>

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
                <button className="save-btn" onClick={addNewAddress}>
                  Save Address
                </button>
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
              {loading ? "Processing..." : `Pay ₹${subtotal}`}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <aside className="order-summary">
          <h2>Order Summary</h2>

          {cart.map((item, i) => (
            <div key={i} className="summary-line">
              <span>{item.name}</span>

              <div className="qty-controls">
                <button onClick={() => updateQty(i, -1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(i, 1)}>+</button>
              </div>

              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="summary-total">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
