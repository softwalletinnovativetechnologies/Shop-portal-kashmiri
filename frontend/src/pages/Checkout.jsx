import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, clearCart } from "../utils/cart";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-hot-toast";
import "react-phone-input-2/lib/style.css";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const cart = getCart();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      toast.error("Login required");
      navigate("/login");
    }
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [payment, setPayment] = useState("COD");

  // 💾 Save order
  const saveOrder = async (status, razorpay = {}) => {
    await fetch("http://localhost:5001/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user._id,
        items: cart,
        address,
        paymentMethod: payment,
        paymentStatus: status,
        totalAmount: subtotal,
        razorpay,
      }),
    });
  };

  // 🛒 PLACE ORDER
  const placeOrder = async () => {
    if (!address.name || !address.phone || !address.address) {
      toast.error("Fill address");
      return;
    }

    // COD
    if (payment === "COD") {
      await saveOrder("PENDING");
      clearCart();
      toast.success("Order placed");
      navigate("/order-success");
      return;
    }

    // ONLINE
    try {
      const res = await fetch("http://localhost:5001/api/orders/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: subtotal }),
      });

      const order = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Kashmiri Gifts",
        order_id: order.id,
        handler: async (response) => {
          await saveOrder("PAID", response);
          clearCart(); // ✅ FIXED
          toast.success("Payment successful");
          navigate("/order-success");
        },
      };

      new window.Razorpay(options).open();
    } catch {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <input
        placeholder="Full Name"
        onChange={(e) => setAddress({ ...address, name: e.target.value })}
      />

      <PhoneInput
        country="in"
        value={address.phone}
        onChange={(v) => setAddress({ ...address, phone: v })}
      />

      <textarea
        placeholder="Full Address"
        onChange={(e) => setAddress({ ...address, address: e.target.value })}
      />

      <input
        placeholder="City"
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
      />

      <input
        placeholder="Pincode"
        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
      />

      <label>
        <input
          type="radio"
          checked={payment === "COD"}
          onChange={() => setPayment("COD")}
        />
        Cash on Delivery
      </label>

      <label>
        <input
          type="radio"
          checked={payment === "ONLINE"}
          onChange={() => setPayment("ONLINE")}
        />
        Online Payment (Razorpay)
      </label>

      <h3>Total ₹{subtotal}</h3>

      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}
