import { useEffect, useState } from "react";
import "./adminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5001/api/admin/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, orderStatus: status } : o)),
    );
  };

  if (loading) return <p className="loading">Loading Orders...</p>;

  return (
    <div className="admin-orders">
      <h1>Orders</h1>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-header">
            <div>
              <strong>Order #{order._id.slice(-6)}</strong>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <select
              value={order.orderStatus}
              onChange={(e) => updateStatus(order._id, e.target.value)}
            >
              <option>PLACED</option>
              <option>CONFIRMED</option>
              <option>SHIPPED</option>
              <option>OUT_FOR_DELIVERY</option>
              <option>DELIVERED</option>
              <option>CANCELLED</option>
            </select>
          </div>

          {/* TIMELINE */}
          <div className="timeline">
            {[
              "PLACED",
              "CONFIRMED",
              "SHIPPED",
              "OUT_FOR_DELIVERY",
              "DELIVERED",
            ].map((step) => (
              <span
                key={step}
                className={
                  step === order.orderStatus ||
                  [
                    "PLACED",
                    "CONFIRMED",
                    "SHIPPED",
                    "OUT_FOR_DELIVERY",
                    "DELIVERED",
                  ].indexOf(step) <
                    [
                      "PLACED",
                      "CONFIRMED",
                      "SHIPPED",
                      "OUT_FOR_DELIVERY",
                      "DELIVERED",
                    ].indexOf(order.orderStatus)
                    ? "active"
                    : ""
                }
              >
                {step.replaceAll("_", " ")}
              </span>
            ))}
          </div>

          <div className="order-footer">
            <span>Total: ₹{order.totalAmount}</span>
            <span>{order.paymentMethod}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
