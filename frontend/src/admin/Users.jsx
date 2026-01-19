import { useEffect, useState } from "react";
import "./adminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = () =>
    fetch("http://localhost:5001/api/admin/users")
      .then((res) => res.json())
      .then(setUsers);

  useEffect(load, []);

  const toggleBlock = async (id) => {
    await fetch(`http://localhost:5001/api/admin/users/${id}/block`, {
      method: "PUT",
    });
    load();
  };

  const toggleRole = async (id) => {
    await fetch(`http://localhost:5001/api/admin/users/${id}/role`, {
      method: "PUT",
    });
    load();
  };

  return (
    <div className="admin-users">
      <h1>Users</h1>

      <div className="table">
        <div className="thead">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {users.map((u) => (
          <div className="row" key={u._id}>
            <span>{u.name}</span>
            <span>{u.email}</span>

            <span className={`badge ${u.role}`}>{u.role}</span>

            <span className={u.isBlocked ? "blocked" : "active"}>
              {u.isBlocked ? "Blocked" : "Active"}
            </span>

            <div className="actions">
              <button onClick={() => toggleRole(u._id)}>Change Role</button>
              <button
                className={u.isBlocked ? "green" : "red"}
                onClick={() => toggleBlock(u._id)}
              >
                {u.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
