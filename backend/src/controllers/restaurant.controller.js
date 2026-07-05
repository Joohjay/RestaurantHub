import pool from "../db.js";
import { isOptionalCoordinate, isPositiveNumber, missingFields } from "../utils/validation.js";

export async function getRestaurants(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, description, location, category, rating, emoji, image, latitude, longitude
       FROM restaurants
       ORDER BY name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load restaurants." });
  }
}

export async function getOwnerRestaurants(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, description, location, category, rating, emoji, image, latitude, longitude
       FROM restaurants
       WHERE owner_id = $1
       ORDER BY name`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load owner restaurants." });
  }
}

export async function getRestaurantById(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, description, location, category, rating, emoji, image, latitude, longitude, owner_id
       FROM restaurants
       WHERE id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    const menuResult = await pool.query(
      `SELECT id, restaurant_id, name, description, price, image, available
       FROM menu_items
       WHERE restaurant_id = $1
       ORDER BY name`,
      [req.params.id]
    );

    res.json({
      ...result.rows[0],
      menu: menuResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load restaurant." });
  }
}

export async function createRestaurant(req, res) {
  const { name, description, location, latitude, longitude, category, rating, emoji } = req.body;
  const owner_id = req.user?.userId;

  const missing = missingFields(req.body, ["name", "location"]);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}.` });
  }

  if (!isOptionalCoordinate(latitude) || !isOptionalCoordinate(longitude)) {
    return res.status(400).json({ message: "Latitude and longitude must be valid numbers." });
  }

  if (rating && !isPositiveNumber(rating)) {
    return res.status(400).json({ message: "Rating must be a positive number." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO restaurants (name, description, location, latitude, longitude, category, rating, emoji, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, description, location, latitude || null, longitude || null, category, rating || null, emoji || null, owner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create restaurant." });
  }
}

export async function updateRestaurant(req, res) {
  const { name, description, location, latitude, longitude, category, rating, emoji } = req.body;

  const missing = missingFields(req.body, ["name", "location"]);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}.` });
  }

  if (!isOptionalCoordinate(latitude) || !isOptionalCoordinate(longitude)) {
    return res.status(400).json({ message: "Latitude and longitude must be valid numbers." });
  }

  if (rating && !isPositiveNumber(rating)) {
    return res.status(400).json({ message: "Rating must be a positive number." });
  }

  try {
    const result = await pool.query(
      `UPDATE restaurants SET name = $1, description = $2, location = $3, latitude = $4,
       longitude = $5, category = $6, rating = $7, emoji = $8 WHERE id = $9 AND owner_id = $10 RETURNING *`,
      [name, description, location, latitude || null, longitude || null, category, rating || null, emoji || null, req.params.id, req.user.userId]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Restaurant not found or access denied." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update restaurant." });
  }
}

export async function deleteRestaurant(req, res) {
  try {
    const result = await pool.query(
      "DELETE FROM restaurants WHERE id = $1 AND owner_id = $2 RETURNING *",
      [req.params.id, req.user.userId]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Restaurant not found or access denied." });
    }
    res.json({ message: "Restaurant deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete restaurant." });
  }
}
