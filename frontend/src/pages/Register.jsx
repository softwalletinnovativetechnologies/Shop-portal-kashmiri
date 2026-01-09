import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">
      <div className="auth-card slide-right">
        <div className="auth-tabs">
          <span onClick={() => navigate("/login")}>Sign In</span>
          <span className="active">Sign Up</span>
        </div>

        <h2>Create Account</h2>

        <input type="text" placeholder="Full Name" />

        <input type="email" placeholder="Email Address" />

        <input type="tel" placeholder="Mobile Number" maxLength="10" />

        <div className="otp-row">
          <input type="text" placeholder="Enter OTP" className="otp-input" />

          <button className="otp-btn">Send OTP</button>
        </div>

        <input type="password" placeholder="Password" />

        <button className="primary-btn">Sign Up</button>

        <button className="google-btn">
          <FcGoogle size={22} />
          <span>Sign up with Google</span>
        </button>
      </div>
    </div>
  );
}
