import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">
      <div className="auth-card slide-left">
        <div className="auth-tabs">
          <span className="active">Sign In</span>
          <span onClick={() => navigate("/register")}>Sign Up</span>
        </div>

        <h2>Welcome Back</h2>

        <input type="email" placeholder="Email Address" />
        <input type="password" placeholder="Password" />

        <button className="primary-btn">Login</button>
        <button className="google-btn">
          <FcGoogle size={22} />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
