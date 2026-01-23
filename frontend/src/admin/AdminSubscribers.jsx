import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "./adminSubscribers.css";

export default function AdminSubscribers() {
  const [subs, setSubs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5001/api/admin/newsletter", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSubs(Array.isArray(data) ? data : []))
      .catch(() => setSubs([]));
  }, []);

  const unsubscribe = async (id) => {
    await fetch(
      `http://localhost:5001/api/admin/newsletter/${id}/unsubscribe`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setSubs((prev) =>
      prev.map((s) => (s._id === id ? { ...s, status: "UNSUBSCRIBED" } : s)),
    );

    toast.success("User unsubscribed");
  };

  return (
    <div className="admin-page">
      <h1>Newsletter Subscribers</h1>

      <div className="admin-table">
        <div className="table-head">
          <span>Email</span>
          <span>Status</span>
          <span>Subscribed At</span>
          <span>Action</span>
        </div>

        {subs.map((s) => (
          <div className="table-row" key={s._id}>
            <span>{s.email}</span>
            <span className={s.status === "ACTIVE" ? "active" : "inactive"}>
              {s.status}
            </span>
            <span>{new Date(s.createdAt).toLocaleDateString()}</span>
            <button
              disabled={s.status !== "ACTIVE"}
              onClick={() => unsubscribe(s._id)}
            >
              Unsubscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
