import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { apiRequest, getStoredUser, saveAuth } from "../utils/api"

function Signup() {
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const nextPath = location.state?.from || "/"

  useEffect(() => {
    if (getStoredUser()) {
      navigate(nextPath, { replace: true })
    }
  }, [navigate, nextPath])

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!name || !email || !password) {
      setError("Please fill in all fields")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: { name, email, password }
      })
      saveAuth(data.user)
      navigate(nextPath, { replace: true })
    } catch (err) {
      setError(err.message || "Could not connect to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left__overlay" />
        <div className="auth-left__text">
          <Link to="/" className="auth-logo">The Third Sip</Link>
          <blockquote className="auth-quote">
            "Good coffee deserves<br />
            good company.<br />
            Join us."
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
          <h1 className="auth-title">Create account.</h1>
          <p className="auth-sub">Join The Third Sip family</p>

          <div className="auth-note">
            <p>Create your account to save time while ordering from the menu.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup
