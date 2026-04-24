import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiRequest, saveAdminAuth } from "../utils/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("admin@thirdsip.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/api/auth/admin-login", {
        method: "POST",
        body: { email, password },
      });

      saveAdminAuth(data.token, data.user);
      navigate(location.state?.from || "/admin/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Could not sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left__overlay" />
        <div className="auth-left__text">
          <Link to="/" className="auth-logo">The Third Sip</Link>
          <blockquote className="auth-quote">
            "Behind every calm service<br />
            is a team that knows<br />
            exactly what is happening."
          </blockquote>
        </div>
      </div>

      <div className="auth-right">
        <Link to="/" className="auth-back">Back</Link>

        <motion.div
          className="auth-box"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="auth-title">Admin access.</h1>
          <p className="auth-sub">Sign in to manage orders, stock, and menu items.</p>

          <div className="auth-note">
            <p>Only users with the admin role can enter here.</p>
            <p className="auth-note__hint">Demo login: admin@thirdsip.com / Admin@123</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
