import { useEffect, useState } from "react";
import "./dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalUsers: 0,
    pendingOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Orders</p>
          <h2>{stats.totalOrders}</h2>
        </div>

        <div className="stat-card">
          <p>Total Sales</p>
          <h2>₹{stats.totalSales.toLocaleString()}</h2>
        </div>

        <div className="stat-card">
          <p>Total Users</p>
          <h2>{stats.totalUsers}</h2>
        </div>

        <div className="stat-card highlight">
          <p>Pending Orders</p>
          <h2>{stats.pendingOrders}</h2>
        </div>
      </div>
    </div>
  );
}
