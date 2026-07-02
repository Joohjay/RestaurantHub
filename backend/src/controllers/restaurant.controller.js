import pool from "../db.js";

export async function getRestaurants(req, res) {
  try {
    const result = await pool.query("SELECT * FROM restaurants ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load restaurants." });
  }
}

export async function getRestaurantById(req, res) {
  try {
    const result = await pool.query("SELECT * FROM restaurants WHERE id = $1", [req.params.id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "Restaurant not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load restaurant." });
  }
}

export async function createRestaurant(req, res) {
  const { name, description, location, category, owner_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO restaurants (name, description, location, category, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, location, category, owner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create restaurant." });
  }
}

export async function updateRestaurant(req, res) {
  const { name, description, location, category } = req.body;
  try {
    const result = await pool.query(
      "UPDATE restaurants SET name = $1, description = $2, location = $3, category = $4 WHERE id = $5 RETURNING *",
      [name, description, location, category, req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Restaurant not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update restaurant." });
  }
}

export async function deleteRestaurant(req, res) {
  try {
    const result = await pool.query("DELETE FROM restaurants WHERE id = $1 RETURNING *", [req.params.id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "Restaurant not found." });
    }
    res.json({ message: "Restaurant deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete restaurant." });
  }
}
