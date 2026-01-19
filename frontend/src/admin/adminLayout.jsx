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

        <NavLink to="/admin/adminOrders">Orders</NavLink>

        <NavLink to="/admin/adminProducts">Products</NavLink>

        <NavLink to="/admin/Users">Users</NavLink>

        <NavLink to="/admin/settings">Settings</NavLink>
      </aside>

      {/* MAIN CONTENT */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
