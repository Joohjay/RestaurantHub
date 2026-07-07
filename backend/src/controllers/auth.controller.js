import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { env } from "../config/env.js";
import {
  getPasswordValidationErrors,
  isValidEmail,
  isValidPhone,
  missingFields,
  normalizePhone,
} from "../utils/validation.js";

const allowedRegistrationRoles = ["customer", "owner"];

export async function register(req, res) {
  const { name, email, phone, password, confirmPassword, role = "customer" } = req.body;

  const missing = missingFields(req.body, ["name", "email", "phone", "password", "confirmPassword"]);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}.` });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "A valid email address is required." });
  }

  if (!isValidPhone(phone)) {
    return res.status(400).json({ message: "A valid Tanzanian phone number is required." });
  }

  const normalizedPhone = normalizePhone(phone);

  const passwordErrors = getPasswordValidationErrors(password);
  if (passwordErrors.length) {
    return res.status(400).json({
      message: `Password must contain ${passwordErrors.join(", ")}.`,
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  if (!allowedRegistrationRoles.includes(role)) {
    return res.status(400).json({ message: "Role must be customer or owner." });
  }

  try {
    const existingEmail = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingEmail.rows.length) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const existingPhone = await pool.query("SELECT id FROM users WHERE phone = $1", [normalizedPhone]);
    if (existingPhone.rows.length) {
      return res.status(409).json({ message: "Phone number already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role",
      [name, email, normalizedPhone, hashedPassword, role]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, { expiresIn: "7d" });
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

  const trimmedEmail = String(email).trim();
  if (!isValidEmail(trimmedEmail)) {
    return res.status(400).json({ message: "A valid email address is required." });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, phone, password, role FROM users WHERE email = $1",
      [trimmedEmail]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, { expiresIn: "7d" });
    delete user.password;
    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed." });
  }
}

export async function me(req, res) {
  try {
    const result = await pool.query("SELECT id, name, email, phone, role FROM users WHERE id = $1", [req.user.userId]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load user." });
  }
}

export async function updateProfile(req, res) {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email, and phone are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "A valid email address is required." });
  }

  if (!isValidPhone(phone)) {
    return res.status(400).json({ message: "A valid Tanzanian phone number is required." });
  }

  const normalizedPhone = normalizePhone(phone);

  try {
    const existingEmail = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id <> $2",
      [email, req.user.userId]
    );
    if (existingEmail.rows.length) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const existingPhone = await pool.query(
      "SELECT id FROM users WHERE phone = $1 AND id <> $2",
      [normalizedPhone, req.user.userId]
    );
    if (existingPhone.rows.length) {
      return res.status(409).json({ message: "Phone number already in use." });
    }

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, name, email, phone, role",
      [name, email, normalizedPhone, req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile." });
  }
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new password are required." });
  }

  const passwordErrors = getPasswordValidationErrors(newPassword);
  if (passwordErrors.length) {
    return res.status(400).json({
      message: `New password must contain ${passwordErrors.join(", ")}.`,
    });
  }

  try {
    const result = await pool.query("SELECT password FROM users WHERE id = $1", [req.user.userId]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found." });
    }

    const validPassword = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, req.user.userId]);
    res.json({ message: "Password updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to change password." });
  }
}

export async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const trimmedEmail = String(email).trim();
  if (!isValidEmail(trimmedEmail)) {
    return res.status(400).json({ message: "A valid email address is required." });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, phone, role FROM users WHERE email = $1",
      [trimmedEmail]
    );

    if (!result.rows.length) {
      // Return success even if not found to prevent user enumeration
      return res.json({ message: "If an account exists, you can now reset your password." });
    }

    const user = result.rows[0];
    const resetToken = jwt.sign(
      { userId: user.id, purpose: "password_reset" },
      env.jwtSecret,
      { expiresIn: "15m" }
    );

    res.json({
      message: "Account verified. You can now reset your password.",
      token: resetToken,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to process request." });
  }
}

export async function resetPassword(req, res) {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Token, new password, and confirm password are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const passwordErrors = getPasswordValidationErrors(newPassword);
  if (passwordErrors.length) {
    return res.status(400).json({
      message: `Password must contain ${passwordErrors.join(", ")}.`,
    });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (decoded.purpose !== "password_reset") {
      return res.status(401).json({ message: "Invalid reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING id, name, email, phone, role",
      [hashedPassword, decoded.userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = result.rows[0];
    const authToken = jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, { expiresIn: "7d" });
    res.json({ message: "Password reset successful.", user, token: authToken });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Reset token has expired. Please try again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid reset token." });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to reset password." });
  }
}
