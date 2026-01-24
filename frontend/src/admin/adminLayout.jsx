import { NavLink, Outlet } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  return (
    <div className="admin">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Kashmiri Admin</h2>

        <NavLink to="/admin" end>
          Dashboard
        </NavLink>

        <NavLink to="/admin/orders">Orders</NavLink>

        <NavLink to="/admin/products">Products</NavLink>

        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/subscribers">Subscribers</NavLink>
        <NavLink to="/admin/newsletter">Newsletter</NavLink>
        <NavLink to="/admin/coupons">Coupons</NavLink>
        <NavLink to="/admin/settings">Settings</NavLink>
      </aside>

      {/* MAIN CONTENT */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
