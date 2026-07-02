import pool from "../db.js";

export async function getOrders(req, res) {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load orders." });
  }
}

export async function getOrderById(req, res) {
  try {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load order." });
  }
}

export async function createOrder(req, res) {
  const { user_id, restaurant_id, items, total_price, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO orders (user_id, restaurant_id, items, total_price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, restaurant_id, items, total_price, status || "pending"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order." });
  }
}

export async function updateOrderStatus(req, res) {
  const { status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status." });
  }
}
