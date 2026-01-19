import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { addToCart } from "../utils/cart";
import jsPDF from "jspdf";
import "./Orders.css";

export default function OrderHistory() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5001/api/orders/user/${user._id}`)
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => toast.error("Failed to load orders"));
  }, [user]);

  // 🛒 BUY AGAIN
  const buyAgain = (items) => {
    items.forEach(addToCart);
    toast.success("Items added to cart");
  };

  // 🧾 PDF INVOICE (AMAZON STYLE)
  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Kashmiri Gifts", 20, 20);

    doc.setFontSize(11);
    doc.text(`Order ID: ${order._id}`, 20, 35);
    doc.text(
      `Order Date: ${new Date(order.createdAt).toLocaleString()}`,
      20,
      42,
    );
    doc.text(`Payment Method: ${order.paymentMethod}`, 20, 49);
    doc.text(`Payment Status: ${order.paymentStatus}`, 20, 56);

    doc.line(20, 60, 190, 60);

    let y = 70;
    order.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name}  x${item.quantity}  ₹${item.price}`,
        20,
        y,
      );
      y += 8;
    });

    doc.line(20, y + 5, 190, y + 5);
    doc.text(`Total Amount: ₹${order.totalAmount}`, 20, y + 15);

    doc.save(`Kashmiri-Gifts-Invoice-${order._id}.pdf`);
  };

  const steps = [
    "PLACED",
    "CONFIRMED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  return (
    <div className="orders-wrapper">
      <h1 className="page-title">My Orders</h1>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((order) => {
        const activeIndex = steps.indexOf(order.orderStatus || "PLACED");

        return (
          <div className="order-card" key={order._id}>
            {/* HEADER */}
            <div className="order-top">
              <div>
                <span className="label">ORDER</span>
                <strong>#{order._id.slice(-6)}</strong>
              </div>

              <div>
                <span className="label">DATE</span>
                <strong>
                  {new Date(order.createdAt).toLocaleDateString()}
                </strong>
              </div>

              <div>
                <span className="label">TOTAL</span>
                <strong>₹{order.totalAmount}</strong>
              </div>

              <span className={`status ${order.paymentStatus}`}>
                {order.paymentStatus}
              </span>
            </div>

            {/* 🚚 TRACKING */}
            <div className="timeline">
              {steps.map((step, i) => (
                <div
                  key={step}
                  className={`step ${i <= activeIndex ? "active" : ""}`}
                >
                  <span>{i + 1}</span>
                  <p>{step.replaceAll("_", " ")}</p>
                </div>
              ))}
            </div>

            {/* 📦 ITEMS */}
            <div className="items">
              {order.items.map((item, i) => (
                <div className="item-row" key={i}>
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>Qty: {item.quantity}</p>
                    <p className="price">₹{item.price}</p>
                  </div>

                  <button
                    className="buy-again"
                    onClick={() => buyAgain([item])}
                  >
                    Buy Again
                  </button>
                </div>
              ))}
            </div>

            {/* 🔘 ACTIONS */}
            <div className="order-actions">
              <button onClick={() => downloadInvoice(order)}>
                Download Invoice
              </button>

              {order.orderStatus !== "DELIVERED" &&
                order.orderStatus !== "CANCELLED" && (
                  <button
                    className="cancel"
                    onClick={async () => {
                      await fetch(
                        `http://localhost:5001/api/orders/${order._id}/cancel`,
                        { method: "PUT" },
                      );
                      toast.success("Order cancelled");
                      window.location.reload();
                    }}
                  >
                    Cancel Order
                  </button>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
