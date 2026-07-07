import pool from "../db.js";
import { isAllowedValue, isOptionalCoordinate, isPositiveNumber, missingFields } from "../utils/validation.js";

const supportedPaymentMethods = ["cash", "mobile_money"];
const orderStatuses = ["pending", "preparing", "ready", "delivered", "completed", "cancelled"];
const paymentStatuses = ["pending", "unpaid", "paid", "failed", "refunded"];

export async function getOrders(req, res) {
  try {
    let result;
    if (req.user.role === "admin") {
      result = await pool.query(
        `SELECT o.*, r.name AS restaurant_name FROM orders o
         LEFT JOIN restaurants r ON o.restaurant_id = r.id
         ORDER BY o.created_at DESC`
      );
    } else if (req.user.role === "owner") {
      result = await pool.query(
        `SELECT o.* FROM orders o
         JOIN restaurants r ON o.restaurant_id = r.id
         WHERE r.owner_id = $1
         ORDER BY o.created_at DESC`,
        [req.user.userId]
      );
    } else {
      result = await pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [req.user.userId]);
    }
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
    const order = result.rows[0];
    if (req.user.role === "admin") {
      // admin can view any order
    } else if (req.user.role === "owner") {
      const ownerResult = await pool.query(
        "SELECT 1 FROM restaurants WHERE id = $1 AND owner_id = $2",
        [order.restaurant_id, req.user.userId]
      );
      if (!ownerResult.rows.length) {
        return res.status(403).json({ message: "Forbidden." });
      }
    } else if (String(order.user_id) !== String(req.user.userId)) {
      return res.status(403).json({ message: "Forbidden." });
    }
    const itemsResult = await pool.query(
      `SELECT oi.id, oi.order_id, oi.menu_item_id, oi.quantity, oi.price, mi.name, mi.description
       FROM order_items oi
       LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = $1
       ORDER BY oi.id`,
      [req.params.id]
    );

    res.json({ ...order, order_items: itemsResult.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load order." });
  }
}

export async function createOrder(req, res) {
  const {
    restaurant_id,
    items,
    total_price,
    status,
    delivery_address,
    delivery_latitude,
    delivery_longitude,
    is_delivery,
    scheduled_date,
    scheduled_time,
    payment_method,
  } = req.body;
  const user_id = req.user.userId;

  const missing = missingFields(req.body, ["restaurant_id", "items", "total_price"]);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}.` });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "At least one order item is required." });
  }

  if (!isPositiveNumber(total_price)) {
    return res.status(400).json({ message: "Total price must be a positive number." });
  }

  if (!items.every((item) => isPositiveNumber(item.quantity || 1) && isPositiveNumber(item.price))) {
    return res.status(400).json({ message: "Order items must include positive quantity and price values." });
  }

  if (is_delivery && !delivery_address) {
    return res.status(400).json({ message: "Delivery address is required for delivery orders." });
  }

  if (!isOptionalCoordinate(delivery_latitude) || !isOptionalCoordinate(delivery_longitude)) {
    return res.status(400).json({ message: "Delivery coordinates must be valid numbers." });
  }

  if (status && !isAllowedValue(status, orderStatuses)) {
    return res.status(400).json({ message: "Invalid order status." });
  }

  if (!scheduled_date || !scheduled_time) {
    return res.status(400).json({ message: "Scheduled date and time are required." });
  }

  const selectedPaymentMethod = payment_method || "cash";
  if (!supportedPaymentMethods.includes(selectedPaymentMethod)) {
    return res.status(400).json({ message: "Payment method is not supported yet." });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query(
        `INSERT INTO orders (
          user_id, restaurant_id, items, total_price, status,
          delivery_address, delivery_latitude, delivery_longitude,
          is_delivery, scheduled_date, scheduled_time, payment_method, payment_status, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
        RETURNING *`,
        [
          user_id,
          restaurant_id,
          JSON.stringify(items),
          total_price,
          status || "pending",
          delivery_address || null,
          delivery_latitude || null,
          delivery_longitude || null,
          is_delivery || false,
          scheduled_date || null,
          scheduled_time || null,
          selectedPaymentMethod,
          selectedPaymentMethod === "cash" ? "pending" : "unpaid",
        ]
      );

      const order = result.rows[0];
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.id || item.menu_item_id || null, item.quantity || 1, item.price]
        );
      }

      await client.query("COMMIT");
      res.status(201).json(order);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order." });
  }
}

export async function updateOrderStatus(req, res) {
  const { status, payment_status } = req.body;

  if (!status && !payment_status) {
    return res.status(400).json({ message: "No order updates provided." });
  }

  if (status && !isAllowedValue(status, orderStatuses)) {
    return res.status(400).json({ message: "Invalid order status." });
  }

  if (payment_status && !isAllowedValue(payment_status, paymentStatuses)) {
    return res.status(400).json({ message: "Invalid payment status." });
  }

  try {
    const orderResult = await pool.query(
      `SELECT o.id, r.owner_id
       FROM orders o
       LEFT JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.id = $1`,
      [req.params.id]
    );

    if (!orderResult.rows.length) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (
      req.user.role === "owner" &&
      String(orderResult.rows[0].owner_id) !== String(req.user.userId)
    ) {
      return res.status(403).json({ message: "Forbidden." });
    }

    let query = "UPDATE orders SET ";
    const params = [];
    let paramCount = 1;

    if (status) {
      query += `status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (payment_status) {
      if (params.length > 0) query += ", ";
      query += `payment_status = $${paramCount}`;
      params.push(payment_status);
      paramCount++;
    }

    query += `, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`;
    params.push(req.params.id);

    const result = await pool.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status." });
  }
}

export async function processPayment(req, res) {
  const { payment_method } = req.body;
  const orderId = req.params.id;

  if (!payment_method) {
    return res.status(400).json({ message: "Payment method is required." });
  }

  if (payment_method !== "mobile_money") {
    return res.status(400).json({ message: "Only mobile money payment can be processed online right now." });
  }

  try {
    // Validate order exists
    const orderResult = await pool.query("SELECT * FROM orders WHERE id = $1", [orderId]);
    if (!orderResult.rows.length) {
      return res.status(404).json({ message: "Order not found." });
    }

    const order = orderResult.rows[0];

    // Check authorization
    if (String(order.user_id) !== String(req.user.userId)) {
      return res.status(403).json({ message: "Forbidden." });
    }

    if (order.payment_method !== "mobile_money") {
      return res.status(400).json({ message: "This order is not configured for mobile money payment." });
    }

    if (order.payment_status === "paid") {
      return res.status(400).json({ message: "Order is already paid." });
    }

    // Simulate payment processing (in production, integrate with payment gateway like Stripe/PayPal)
    const updateResult = await pool.query(
      `UPDATE orders SET payment_method = $1, payment_status = 'paid', updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [payment_method, orderId]
    );

    res.json({
      message: "Payment processed successfully",
      order: updateResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to process payment." });
  }
}
