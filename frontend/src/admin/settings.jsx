import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "./settings.css";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5001/api/admin/settings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => toast.error("Failed to load settings"));
  }, []);

  const saveSettings = async () => {
    await fetch("http://localhost:5001/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    toast.success("Settings saved successfully");
  };

  if (!settings) return <p>Loading...</p>;

  return (
    <div className="content">
      <h1>Admin Settings</h1>

      {/* STORE SETTINGS */}
      <div className="card">
        <h2>Store Settings</h2>

        <input
          value={settings.storeName || ""}
          placeholder="Store Name"
          onChange={(e) =>
            setSettings({ ...settings, storeName: e.target.value })
          }
        />

        <input
          value={settings.storeEmail || ""}
          placeholder="Store Email"
          onChange={(e) =>
            setSettings({ ...settings, storeEmail: e.target.value })
          }
        />

        <input
          value={settings.storePhone || ""}
          placeholder="Store Phone"
          onChange={(e) =>
            setSettings({ ...settings, storePhone: e.target.value })
          }
        />
      </div>

      {/* PAYMENT SETTINGS */}
      <div className="card">
        <h2>Payment Settings</h2>

        <label>
          <input
            type="checkbox"
            checked={settings.payment.cod}
            onChange={(e) =>
              setSettings({
                ...settings,
                payment: { ...settings.payment, cod: e.target.checked },
              })
            }
          />
          Cash on Delivery
        </label>

        <label>
          <input
            type="checkbox"
            checked={settings.payment.razorpay}
            onChange={(e) =>
              setSettings({
                ...settings,
                payment: { ...settings.payment, razorpay: e.target.checked },
              })
            }
          />
          Razorpay Enabled
        </label>
      </div>

      {/* ORDER SETTINGS */}
      <div className="card">
        <h2>Order Settings</h2>

        <select
          value={settings.order.defaultStatus}
          onChange={(e) =>
            setSettings({
              ...settings,
              order: { ...settings.order, defaultStatus: e.target.value },
            })
          }
        >
          <option>PLACED</option>
          <option>CONFIRMED</option>
          <option>SHIPPED</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={settings.order.allowCancel}
            onChange={(e) =>
              setSettings({
                ...settings,
                order: { ...settings.order, allowCancel: e.target.checked },
              })
            }
          />
          Allow Order Cancellation
        </label>
      </div>

      {/* SAVE */}
      <button onClick={saveSettings} className="save-btn">
        Save Changes
      </button>
    </div>
  );
}
