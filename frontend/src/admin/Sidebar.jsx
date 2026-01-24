import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="sidebar">
      <h2>Kashmiri Admin</h2>

      <NavLink to="/admin">Dashboard</NavLink>
      <NavLink to="/admin/AdminOrders">Orders</NavLink>
      <NavLink to="/admin/AdminProducts">Products</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
      <NavLink to="/admin/coupons">Coupons</NavLink>
      <NavLink to="/admin/subscribers">Subscribers</NavLink>
      <NavLink to="/admin/newsletter">Newsletter</NavLink>
      <NavLink to="/admin/Settings">Settings</NavLink>
    </div>
  );
}
