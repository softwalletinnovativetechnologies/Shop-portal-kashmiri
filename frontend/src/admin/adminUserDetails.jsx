import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "./adminUserDetails.css";

export default function AdminUserDetails() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [queries, setQueries] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER DATA ================= */
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userRes, ordersRes, queriesRes] = await Promise.all([
          fetch(`http://localhost:5001/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`http://localhost:5001/api/admin/users/${id}/orders`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`http://localhost:5001/api/admin/queries/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
        ]);

        if (!userRes.ok || !ordersRes.ok || !queriesRes.ok) {
          throw new Error("Fetch failed");
        }

        const userData = await userRes.json();
        const ordersData = await ordersRes.json();
        const queriesData = await queriesRes.json();

        if (isMounted) {
          setUser(userData);
          setOrders(Array.isArray(ordersData) ? ordersData : []);
          setQueries(Array.isArray(queriesData) ? queriesData : []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user details");
      } finally {
        isMounted && setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  /* ================= SEND ADMIN REPLY ================= */
  const sendReply = async (queryId) => {
    if (!replyText[queryId]?.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5001/api/admin/queries/${queryId}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply: replyText[queryId] }),
      });

      setQueries((prev) =>
        prev.map((q) =>
          q._id === queryId
            ? { ...q, reply: replyText[queryId], status: "RESOLVED" }
            : q,
        ),
      );

      toast.success("Reply sent ✔ Email delivered to user");
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  if (loading) return <p className="loading">Loading user details...</p>;
  if (!user) return <p className="loading">User not found</p>;

  return (
    <div className="admin-user-page">
      {/* ================= USER PROFILE ================= */}
      <section className="card">
        <h2>User Profile</h2>
        <p>
          <b>Name:</b> {user.name}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Phone:</b> {user.phone || "-"}
        </p>
      </section>

      {/* ================= ADDRESSES ================= */}
      <section className="card">
        <h2>Addresses</h2>
        {user.addresses?.length ? (
          user.addresses.map((a, i) => (
            <div key={i} className="address-box">
              <p>
                <b>{a.name}</b>
              </p>
              <p>{a.address}</p>
              <p>
                {a.city}, {a.state} - {a.pincode}
              </p>
              <small>
                {a.countryCode} {a.phone}
              </small>
            </div>
          ))
        ) : (
          <p>No saved addresses</p>
        )}
      </section>

      {/* ================= ORDERS ================= */}
      <section className="card">
        <h2>Orders</h2>
        {orders.length ? (
          orders.map((o) => (
            <div key={o._id} className="order-box">
              <p>
                <b>Order ID:</b> {o._id}
              </p>
              <p>
                <b>Total:</b> ₹{o.totalAmount}
              </p>
              <p>
                <b>Payment:</b> {o.paymentMethod} ({o.paymentStatus})
              </p>
              <p>
                <b>Status:</b> {o.orderStatus}
              </p>
            </div>
          ))
        ) : (
          <p>No orders placed</p>
        )}
      </section>

      {/* ================= USER QUERIES ================= */}
      <section className="card">
        <h2>User Queries</h2>

        {queries.length ? (
          queries.map((q) => (
            <div key={q._id} className="query-box">
              <p>
                <b>Query:</b> {q.query}
              </p>
              <small>
                {new Date(q.createdAt).toLocaleString()} • {q.status}
              </small>

              {q.reply ? (
                <p className="reply">
                  <b>Admin Reply:</b> {q.reply}
                </p>
              ) : (
                <>
                  <textarea
                    placeholder="Write reply..."
                    value={replyText[q._id] || ""}
                    onChange={(e) =>
                      setReplyText({
                        ...replyText,
                        [q._id]: e.target.value,
                      })
                    }
                  />
                  <button onClick={() => sendReply(q._id)}>Send Reply</button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No queries from this user</p>
        )}
      </section>
    </div>
  );
}
