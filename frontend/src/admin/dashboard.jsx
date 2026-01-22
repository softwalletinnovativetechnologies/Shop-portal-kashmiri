import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
    const token = localStorage.getItem("token");
    fetch("http://localhost:5001/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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

  /* ===== CHART DATA ===== */
  const barData = [
    { name: "Orders", value: stats.totalOrders },
    { name: "Users", value: stats.totalUsers },
    { name: "Pending", value: stats.pendingOrders },
  ];

  const lineData = [{ name: "Sales", value: stats.totalSales }];

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      {/* ===== STATS CARDS ===== */}
      <div className="stats-grid">
        <div className="stat">
          <p>Total Orders</p>
          <h2>{stats.totalOrders}</h2>
        </div>

        <div className="stat-card">
          <p>Total Sales</p>
          <h2>₹{stats.totalSales.toLocaleString()}</h2>
        </div>

        <div className="stat-card-1">
          <p>Total Users</p>
          <h2>{stats.totalUsers}</h2>
        </div>

        <div className="stat-card highlight">
          <p>Pending Orders</p>
          <h2>{stats.pendingOrders}</h2>
        </div>
      </div>

      {/* ===== CHART SECTION ===== */}
      <div className="charts-grid">
        {/* BAR CHART */}
        <div className="chart-card">
          <h3>Orders Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#1f4d3a"
                radius={[8, 8, 0, 0]}
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="chart-card">
          <h3>Total Sales</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2f6b52"
                strokeWidth={3}
                dot={{ r: 6 }}
                animationDuration={1400}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
