import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      localStorage.removeItem("cart");
    }, 500);
  }, []);

  return (
    <div className="order-success-page">
      <div className="success-card">
        <div className="checkmark">✓</div>

        <h1>Order Placed Successfully</h1>
        <p>
          Thank you for shopping with <b>Kashmiri Gifts</b>.
        </p>

        <div className="success-actions">
          <button onClick={() => navigate("/orders")}>View My Orders</button>
          <button className="outline" onClick={() => navigate("/shop")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
