import pool from "../db.js";
import { isPositiveNumber, missingFields } from "../utils/validation.js";

async function ownerOwnsRestaurant(ownerId, restaurantId) {
  const result = await pool.query(
    "SELECT 1 FROM restaurants WHERE id = $1 AND owner_id = $2",
    [restaurantId, ownerId]
  );
  return result.rows.length > 0;
}

export async function getMenuItems(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, restaurant_id, name, description, price, image, available
       FROM menu_items
       WHERE restaurant_id = $1
       ORDER BY name`,
      [req.params.restaurantId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load menu items." });
  }
}

export async function createMenuItem(req, res) {
  const { name, description, price, image, available = true } = req.body;
  const restaurantId = req.params.restaurantId;

  const missing = missingFields(req.body, ["name", "price"]);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}.` });
  }

  if (!isPositiveNumber(price)) {
    return res.status(400).json({ message: "Price must be a positive number." });
  }

  try {
    const ownsRestaurant = await ownerOwnsRestaurant(req.user.userId, restaurantId);
    if (!ownsRestaurant) {
      return res.status(403).json({ message: "Forbidden." });
    }

    const result = await pool.query(
      `INSERT INTO menu_items (restaurant_id, name, description, price, image, available)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [restaurantId, name, description || null, price, image || null, available]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create menu item." });
  }
}

export async function updateMenuItem(req, res) {
  const { name, description, price, image, available = true } = req.body;

  const missing = missingFields(req.body, ["name", "price"]);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}.` });
  }

  if (!isPositiveNumber(price)) {
    return res.status(400).json({ message: "Price must be a positive number." });
  }

  try {
    const itemResult = await pool.query(
      `SELECT mi.restaurant_id
       FROM menu_items mi
       JOIN restaurants r ON mi.restaurant_id = r.id
       WHERE mi.id = $1 AND r.owner_id = $2`,
      [req.params.id, req.user.userId]
    );

    if (!itemResult.rows.length) {
      return res.status(404).json({ message: "Menu item not found or access denied." });
    }

    const result = await pool.query(
      `UPDATE menu_items
       SET name = $1, description = $2, price = $3, image = $4, available = $5
       WHERE id = $6
       RETURNING *`,
      [name, description || null, price, image || null, available, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update menu item." });
  }
}

export async function deleteMenuItem(req, res) {
  try {
    const result = await pool.query(
      `DELETE FROM menu_items mi
       USING restaurants r
       WHERE mi.id = $1
         AND mi.restaurant_id = r.id
         AND r.owner_id = $2
       RETURNING mi.*`,
      [req.params.id, req.user.userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Menu item not found or access denied." });
    }

    res.json({ message: "Menu item deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete menu item." });
  }
}
