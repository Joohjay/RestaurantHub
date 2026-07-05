import pool from "../db.js";
import { isAllowedValue, isPositiveNumber, missingFields } from "../utils/validation.js";

const reservationStatuses = ["pending", "confirmed", "cancelled", "completed"];

export async function getReservations(req, res) {
  try {
    let result;
    if (req.user.role === "owner") {
      result = await pool.query(
        `SELECT r.*, rest.name AS restaurant_name, u.name AS customer_name, u.email AS customer_email
         FROM reservations r
         JOIN restaurants rest ON r.restaurant_id = rest.id
         LEFT JOIN users u ON r.user_id = u.id
         WHERE rest.owner_id = $1
         ORDER BY r.reservation_date DESC`,
        [req.user.userId]
      );
    } else {
      result = await pool.query(
        `SELECT r.*, rest.name AS restaurant_name
         FROM reservations r
         LEFT JOIN restaurants rest ON r.restaurant_id = rest.id
         WHERE r.user_id = $1
         ORDER BY r.reservation_date DESC`,
        [req.user.userId]
      );
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load reservations." });
  }
}

export async function getReservationById(req, res) {
  try {
    const result = await pool.query("SELECT * FROM reservations WHERE id = $1", [req.params.id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "Reservation not found." });
    }
    const reservation = result.rows[0];
    if (req.user.role === "owner") {
      const ownerResult = await pool.query(
        "SELECT 1 FROM restaurants WHERE id = $1 AND owner_id = $2",
        [reservation.restaurant_id, req.user.userId]
      );
      if (!ownerResult.rows.length) {
        return res.status(403).json({ message: "Forbidden." });
      }
    } else if (reservation.user_id !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden." });
    }
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load reservation." });
  }
}

export async function createReservation(req, res) {
  const { restaurant_id, reservation_date, reservation_time, guests, status } = req.body;
  const user_id = req.user.userId;

  const missing = missingFields(req.body, ["restaurant_id", "reservation_date", "reservation_time", "guests"]);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}.` });
  }

  if (!isPositiveNumber(guests)) {
    return res.status(400).json({ message: "Guest count must be a positive number." });
  }

  if (status && !isAllowedValue(status, reservationStatuses)) {
    return res.status(400).json({ message: "Invalid reservation status." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO reservations (user_id, restaurant_id, reservation_date, reservation_time, guests, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, restaurant_id, reservation_date, reservation_time, guests, status || "pending"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create reservation." });
  }
}

export async function updateReservation(req, res) {
  const { status } = req.body;

  if (!isAllowedValue(status, reservationStatuses)) {
    return res.status(400).json({ message: "Invalid reservation status." });
  }

  try {
    const result = await pool.query(
      `UPDATE reservations r
       SET status = $1
       FROM restaurants rest
       WHERE r.id = $2
         AND r.restaurant_id = rest.id
         AND rest.owner_id = $3
       RETURNING r.id`,
      [status, req.params.id, req.user.userId]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    const updated = await pool.query(
      `SELECT r.*, rest.name AS restaurant_name, u.name AS customer_name, u.email AS customer_email
       FROM reservations r
       JOIN restaurants rest ON r.restaurant_id = rest.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.id = $1`,
      [result.rows[0].id]
    );

    res.json(updated.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update reservation." });
  }
}
