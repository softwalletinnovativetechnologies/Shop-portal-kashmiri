import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, removeFromCart, updateQuantity } from "../utils/cart";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  /* LOAD CART */
  useEffect(() => {
    setCart(getCart());

    const syncCart = () => setCart(getCart());
    window.addEventListener("cartUpdated", syncCart);

    return () => window.removeEventListener("cartUpdated", syncCart);
  }, []);

  /* INCREASE QTY */
  const increaseQty = (item) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  /* DECREASE QTY (auto remove at 0 handled in utils) */
  const decreaseQty = (item) => {
    updateQuantity(item.id, item.quantity - 1);
  };

  /* REMOVE */
  const handleRemove = (id) => {
    removeFromCart(id);
  };

  /* SUBTOTAL */
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  /* EMPTY CART */
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <img src="/images/empty-cart.png" alt="Empty Cart" />
        <h2>Your cart is empty</h2>
        <p>Add premium Kashmiri products to continue</p>

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
            {/* IMAGE */}
            <div className="cart-img">
              <img src={item.image} alt={item.name} />
            </div>

            {/* INFO */}
            <div className="cart-info">
              <h3>{item.name}</h3>
              <p className="price">₹{item.price}</p>
              <p className="desc">{item.description}</p>

              {/* QUANTITY */}
              <div className="qty-box">
                <button onClick={() => decreaseQty(item)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item)}>+</button>
              </div>

              {/* ITEM TOTAL */}
              <p className="item-total">
                Item Total: ₹{item.price * item.quantity}
              </p>

              {/* ACTIONS */}
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

          <button
            className="btn-primary checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Checkout Securely
          </button>
        </div>
      </div>
    </div>
  );
}
