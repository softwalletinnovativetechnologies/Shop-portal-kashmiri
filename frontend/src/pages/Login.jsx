import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./Login.css";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }
      if (!data || !data.role) {
        toast.error("Invalid login response");
        return;
      }
      // 🔐 SAFE TOKEN HANDLING
      localStorage.setItem("token", data.token || "logged_in");
      localStorage.setItem("user", JSON.stringify(data));

      window.dispatchEvent(new Event("userChanged"));

      toast.success("Login successful");

      if (data.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/account", { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <p className="auth-footer">
          New user? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}
