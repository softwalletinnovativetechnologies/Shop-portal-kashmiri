import { useEffect, useState } from "react";
import "./adminNewsletter.css";

export default function AdminNewsletterStats() {
  const [stats, setStats] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5001/api/admin/subscriber/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setStats);
  }, []);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Subscribers</h3>
        <p>{stats.total}</p>
      </div>

      <div className="stat-card">
        <h3>Active</h3>
        <p>{stats.active}</p>
      </div>

      <div className="stat-card">
        <h3>Unsubscribed</h3>
        <p>{stats.inactive}</p>
      </div>

      <div className="stat-card">
        <h3>Last 7 Days</h3>
        <p>{stats.last7Days}</p>
      </div>
    </div>
  );
}
