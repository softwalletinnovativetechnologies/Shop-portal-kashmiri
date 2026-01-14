import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, removeFromCart, updateQuantity } from "../utils/cart";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const increaseQty = (id) => {
    updateQuantity(id, 1);
    setCart(getCart());
  };

  const decreaseQty = (id, qty) => {
    if (qty === 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, -1);
    }
    setCart(getCart());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <img src="/images/empty-cart.png" alt="Empty Cart" />
        <p>Your cart is empty 🛒</p>
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

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
              <p className="desc">{item.description}</p>

              <div className="qty-box">
                <button onClick={() => decreaseQty(item.id, item.quantity)}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>

              <p className="item-total">
                Item Total: ₹{item.price * item.quantity}
              </p>

              <div className="cart-actions">
                <button
                  className="btn-outline"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
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

          <button className="btn-primary checkout-btn">
            Checkout Securely
          </button>
        </div>
      </div>
    </div>
  );
}
