import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "./Account.css";

export default function Account() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [queries, setQueries] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    countryCode: "+91",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // 🔹 FETCH USER DATA
  useEffect(() => {
    fetch("http://localhost:5001/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setAddresses(data.addresses || []);
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      })
      .catch(() => {
        localStorage.clear();
        window.location.href = "/login";
      });
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5001/api/contact/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setQueries(data);
        }
      });
  }, []);

  // 🔹 UPDATE PROFILE
  const saveProfile = async () => {
    const res = await fetch(`http://localhost:5001/api/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    const updated = await res.json();
    setUser(updated);
    toast.success("Profile updated");
  };

  // 🔹 SYNC ADDRESSES
  const syncAddresses = async (updated) => {
    const res = await fetch(`http://localhost:5001/api/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ addresses: updated }),
    });
    const data = await res.json();
    setAddresses(data.addresses || []);
  };

  // 🔹 ADD NEW ADDRESS
  const addNewAddress = async () => {
    const { name, phone, address, city, state, pincode } = newAddress;

    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error("Please fill all address fields");
      return;
    }

    const updated = [
      ...addresses,
      {
        ...newAddress,
        isDefault: addresses.length === 0,
      },
    ];

    await syncAddresses(updated);
    setShowAdd(false);
    toast.success("Address added");

    setNewAddress({
      name: "",
      phone: "",
      countryCode: "+91",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
  };
  if (!user) return null;
  return (
    <div className="account-page">
      <h1>My Account</h1>

      {/* PROFILE */}
      <div className="account-card">
        <h2>Profile Details</h2>

        <input
          value={profile.name}
          placeholder="Full Name"
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />

        <input
          value={profile.email}
          placeholder="Email"
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />

        <div className="phone-row">
          <input value="+91" disabled />
          <input
            value={profile.phone}
            placeholder="Mobile Number"
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>

        <button onClick={saveProfile}>Save Profile</button>
      </div>

      {/* ADDRESSES */}
      <div className="account-card">
        <h2>Your Addresses</h2>

        {addresses.map((a, i) => (
          <div
            key={i}
            className={`address-card ${a.isDefault ? "default" : ""}`}
          >
            <div className="address-info">
              <strong>{a.name}</strong>
              <p>{a.address}</p>
              <p>
                {a.city}, {a.state} - {a.pincode}
              </p>
              <small>
                {a.countryCode} {a.phone}
              </small>
            </div>

            <div className="address-actions">
              {!a.isDefault && (
                <button
                  className="link-btn"
                  onClick={() =>
                    syncAddresses(
                      addresses.map((ad, idx) => ({
                        ...ad,
                        isDefault: idx === i,
                      })),
                    )
                  }
                >
                  Set as default
                </button>
              )}

              <button onClick={() => setEditIndex(i)}>Edit</button>

              <button
                className="danger"
                onClick={() =>
                  syncAddresses(addresses.filter((_, idx) => idx !== i))
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <button className="add-btn" onClick={() => setShowAdd(true)}>
          + Add New Address
        </button>

        {showAdd && (
          <div className="new-address">
            <input
              placeholder="Full Name"
              value={newAddress.name}
              onChange={(e) =>
                setNewAddress({ ...newAddress, name: e.target.value })
              }
            />

            <input
              placeholder="Address"
              value={newAddress.address}
              onChange={(e) =>
                setNewAddress({ ...newAddress, address: e.target.value })
              }
            />

            <div className="phone-row">
              <input value="+91" disabled />
              <input
                placeholder="Mobile Number"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
            </div>

            <input
              placeholder="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />

            <input
              placeholder="State"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />

            <input
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
            />

            <button onClick={addNewAddress}>Save Address</button>
          </div>
        )}
      </div>
      {/* ================= MY QUERIES ================= */}
      <section className="card">
        <h2>My Queries</h2>

        {queries.length ? (
          queries.map((q) => (
            <div key={q._id} className="query-box">
              <p>
                <b>Query:</b> {q.query}
              </p>
              <small>Status: {q.status}</small>

              {q.reply && (
                <p className="reply">
                  <b>Admin Reply:</b> {q.reply}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No queries yet</p>
        )}
      </section>
    </div>
  );
}
