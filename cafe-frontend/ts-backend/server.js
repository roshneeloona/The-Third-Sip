const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")

const app = express()
app.use(cors())
app.use(express.json())

const JWT_SECRET = "thirdsip_secret_key"

const DB_FILE = path.join(__dirname, "users.json")

function loadUsers() {
  if (!fs.existsSync(DB_FILE)) return []
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"))
}

function saveUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2))
}

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const users = loadUsers()

  const existingUser = users.find(u => u.email === email)
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = { id: users.length + 1, name, email, password: hashedPassword }
  users.push(user)
  saveUsers(users)

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  })
})

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body

  const users = loadUsers()

  const user = users.find(u => u.email === email)
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" })
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  })
})

app.listen(5000, () => console.log("Server running on http://localhost:5000"))