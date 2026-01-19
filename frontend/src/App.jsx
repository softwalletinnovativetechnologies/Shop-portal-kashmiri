import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

/* USER PAGES */
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";

/* ADMIN */
import AdminLayout from "./admin/adminLayout";
import Dashboard from "./admin/dashboard";
import AdminOrders from "./admin/adminOrders";
import AdminProducts from "./admin/adminProducts";
import AdminUsers from "./admin/Users";
import Settings from "./admin/settings";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* USER */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="adminOrders" element={<AdminOrders />} />
          <Route path="adminProducts" element={<AdminProducts />} />
          <Route path="Users" element={<AdminUsers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
