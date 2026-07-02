import pool from "../db.js";

export async function getReservations(req, res) {
  try {
    const result = await pool.query("SELECT * FROM reservations ORDER BY reservation_date DESC");
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
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load reservation." });
  }
}

export async function createReservation(req, res) {
  const { user_id, restaurant_id, reservation_date, reservation_time, guests, status } = req.body;
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
  try {
    const result = await pool.query(
      "UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Reservation not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update reservation." });
  }
}
