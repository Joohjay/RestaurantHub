import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const jwtSecret = process.env.JWT_SECRET || "supersecret";

export async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role || "customer"]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: "7d" });
    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed." });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const result = await pool.query("SELECT id, name, email, password, role FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: "7d" });
    delete user.password;
    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed." });
  }
}
