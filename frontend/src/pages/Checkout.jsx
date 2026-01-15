import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, clearCart } from "../utils/cart";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-hot-toast";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const cart = getCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ================= ADDRESS STATE ================= */
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  /* ================= PAYMENT ================= */
  const [payment, setPayment] = useState("COD");

  /* ================= SAVE / UPDATE ADDRESS ================= */
  const saveAddress = () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.phone.length < 10) {
      toast.error("Enter a valid phone number");
      return;
    }

    if (editId) {
      setAddresses(
        addresses.map((a) => (a.id === editId ? { ...form, id: editId } : a))
      );
      toast.success("Address updated");
    } else {
      setAddresses([...addresses, { ...form, id: Date.now() }]);
      toast.success("Address saved");
    }

    setShowForm(false);
    setEditId(null);
    setForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
    });
  };

  const editAddress = (addr) => {
    setForm(addr);
    setEditId(addr.id);
    setShowForm(true);
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    if (selectedAddress === id) setSelectedAddress(null);
    toast.success("Address deleted");
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    clearCart();
    toast.success("Order placed successfully 🎉");
    navigate("/");
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        {/* ================= ADDRESS ================= */}
        <div className="checkout-card">
          <h2>Delivery Address</h2>

          {addresses.map((addr) => (
            <div className="saved-address" key={addr.id}>
              <label className="address-radio">
                <input
                  type="radio"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                />
                <div className="address-info">
                  <strong>{addr.name}</strong>
                  <p>
                    {addr.address}, {addr.city} – {addr.pincode}
                  </p>
                  <span>{addr.phone}</span>
                </div>
              </label>

              <div className="address-actions">
                <button onClick={() => editAddress(addr)}>Edit</button>
                <button onClick={() => deleteAddress(addr.id)}>Delete</button>
              </div>
            </div>
          ))}

          {!showForm && (
            <button className="link-btn" onClick={() => setShowForm(true)}>
              + Add New Address
            </button>
          )}

          {showForm && (
            <div className="address-form">
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              {/* PHONE INPUT */}
              <PhoneInput
                country={"in"}
                value={form.phone}
                onChange={(value) => setForm({ ...form, phone: value })}
                inputClass="phone-input"
                containerClass="phone-container"
                countryCodeEditable={false}
              />

              <textarea
                placeholder="Full Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <input
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />

              <input
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />

              <button className="btn-primary" onClick={saveAddress}>
                {editId ? "Update Address" : "Save Address"}
              </button>
            </div>
          )}
        </div>

        {/* ================= PAYMENT ================= */}
        <div className="checkout-card">
          <h2>Payment Method</h2>

          <label className="payment-option">
            <input
              type="radio"
              checked={payment === "COD"}
              onChange={() => setPayment("COD")}
            />
            <span>Cash on Delivery</span>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              checked={payment === "UPI"}
              onChange={() => setPayment("UPI")}
            />
            <span>UPI</span>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              checked={payment === "CARD"}
              onChange={() => setPayment("CARD")}
            />
            <span>Credit / Debit Card</span>
          </label>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="checkout-card summary">
          <h2>Order Summary</h2>

          <p>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </p>
          <p>
            <span>Shipping</span>
            <span>FREE</span>
          </p>

          <hr />

          <p className="total">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </p>

          <button className="btn-primary" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
