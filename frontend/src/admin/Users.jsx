import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./adminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5001/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {
        toast.error("Failed to load users");
        setUsers([]);
      });
  }, []);

  return (
    <div className="admin-page">
      <h1>Users</h1>

      <div className="admin-table">
        <div className="table-head">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Action</span>
        </div>

        {users.map((u) => (
          <div className="table-row" key={u._id}>
            <span>{u.name}</span>
            <span>{u.email}</span>
            <span>{u.phone || "-"}</span>
            <button onClick={() => navigate(`/admin/users/${u._id}`)}>
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
