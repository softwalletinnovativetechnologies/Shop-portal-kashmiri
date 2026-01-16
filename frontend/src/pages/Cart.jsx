import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, removeFromCart, setQuantity } from "../utils/cart";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  /* ================= HELPERS ================= */
  const refreshCart = () => {
    setCart(getCart());
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (id, currentQty) => {
    const newQty = currentQty + 1;
    setQuantity(id, newQty);
    refreshCart();
  };

  const decreaseQty = (id, currentQty) => {
    if (currentQty <= 1) {
      removeFromCart(id);
    } else {
      setQuantity(id, currentQty - 1);
    }
    refreshCart();
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    refreshCart();
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  /* ================= EMPTY CART ================= */
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <img src="/images/empty-cart.png" alt="Empty Cart" />
        <h2>Your cart is empty</h2>

        <Link to="/shop" className="btn-primary small-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ================= CART PAGE ================= */
  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>

      <div className="cart-grid">
        {cart.map((item) => (
          <div className="cart-card" key={item.id}>
            <div className="cart-img">
              <img src={item.image} alt={item.name} />
            </div>

            <div className="cart-info">
              <h3>{item.name}</h3>
              <p className="price">₹{item.price}</p>

              <div className="qty-box">
                <button onClick={() => decreaseQty(item.id, item.quantity)}>
                  −
                </button>

                <span>{item.quantity}</span>

                <button onClick={() => increaseQty(item.id, item.quantity)}>
                  +
                </button>
              </div>

              <p className="item-total">
                Item Total: ₹{Number(item.price) * Number(item.quantity)}
              </p>

              <button
                className="btn-outline"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="cart-summary">
        <div className="summary-box">
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

          <Link to="/checkout" className="btn-primary checkout-btn">
            Checkout Securely
          </Link>
        </div>
      </div>
    </div>
  );
}
