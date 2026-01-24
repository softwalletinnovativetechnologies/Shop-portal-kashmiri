import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { addToCart } from "../utils/cart";
import jsPDF from "jspdf";
import "./Orders.css";

export default function OrderHistory() {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5001/api/orders/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REAL-TIME UPDATE (POLLING) ================= */
  useEffect(() => {
    fetchOrders(); // initial load

    const interval = setInterval(() => {
      fetchOrders(); // auto refresh every 10 sec
    }, 10000);

    return () => clearInterval(interval);
  }, [token]);

  /* ================= BUY AGAIN ================= */

  const buyAgain = (items) => {
    items.forEach(addToCart);
    toast.success("Items added to cart");
  };

  /* ================= DOWNLOAD INVOICE ================= */

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Kashmiri Gifts Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 20, 35);
    doc.text(`Total: ₹${order.totalAmount}`, 20, 45);
    doc.text(`Status: ${order.orderStatus}`, 20, 55);
    doc.save(`invoice-${order._id}.pdf`);
  };
  if (loading) return <p className="loading">Loading Orders...</p>;

  return (
    <div className="orders-wrapper">
      <h1 className="page-title">My Orders</h1>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          {/* ================= ORDER TIMELINE ================= */}
          <div className="order-timeline">
            {order.statusHistory.map((s, i) => (
              <div key={i} className="timeline-step active">
                <span>{s.status.replaceAll("_", " ")}</span>
                <small>{new Date(s.time).toLocaleString()}</small>
              </div>
            ))}
          </div>

          <h3>Order #{order._id.slice(-6)}</h3>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Payment: {order.paymentMethod}</p>
          <p>Status: {order.paymentStatus}</p>
          <p>Status: {order.orderStatus}</p>

          <div className="items">
            {order.items.map((item, i) => (
              <div key={i} className="item-row">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <button
                  className="buy-again-btn"
                  onClick={() => buyAgain([item])}
                >
                  Buy Again
                </button>
              </div>
            ))}
          </div>

          {/* ================= ORDER ACTIONS ================= */}
          <div className="order-actions">
            <button onClick={() => downloadInvoice(order)}>
              Download Invoice
            </button>

            {order.orderStatus !== "DELIVERED" && (
              <button
                className="cancel"
                onClick={async () => {
                  try {
                    await fetch(
                      `http://localhost:5001/api/orders/${order._id}/cancel`,
                      {
                        method: "PUT",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      },
                    );
                    toast.success("Order cancelled");
                    fetchOrders();
                  } catch {
                    toast.error("Cancel failed");
                  }
                }}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
