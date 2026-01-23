import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

/* USER */
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/productDetails";
import Account from "./pages/Account";
import OrderSuccess from "./pages/OrderSuccess";
import Contact from "./pages/Contact";
/* ADMIN */
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./admin/adminLayout";
import Dashboard from "./admin/dashboard";
import AdminOrders from "./admin/adminOrders";
import AdminProducts from "./admin/adminProducts";
import AdminUsers from "./admin/Users";
import Settings from "./admin/settings";
import AdminUserDetails from "./admin/adminUserDetails";
import AdminSubscribers from "./admin/AdminSubscribers";
import AdminSendNewsletter from "./admin/AdminSendNewsletter";
import AdminNewsletterStats from "./admin/AdminNewsletterStats";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ================= USER ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route path="/order-success/:id" element={<OrderSuccess />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetails />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route path="/admin/newsletter" element={<AdminSendNewsletter />} />
          <Route
            path="/admin/newsletter/stats"
            element={<AdminNewsletterStats />}
          />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
