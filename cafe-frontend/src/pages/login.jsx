import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Login failed")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      navigate("/")
    } catch (err) {
      setError("Could not connect to server")
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
            "The first sip wakes you.<br />
            The second soothes you.<br />
            The third — that's where<br />
            the magic lives."
          </blockquote>
        </div>
      </div>

      <div className="auth-right">
        <Link to="/" className="auth-back">← Back</Link>

        <motion.div
          className="auth-box"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="auth-title">Welcome back.</h1>
          <p className="auth-sub">Sign in to your account</p>

          <form className="auth-form" onSubmit={handleSubmit}>

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
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </motion.div>
      </div>

    </div>
  )
}

export default Login