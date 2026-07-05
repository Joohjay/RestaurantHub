import pool from "../db.js";
import { isAllowedValue } from "../utils/validation.js";

const adminAssignableRoles = ["customer", "owner", "admin"];

export async function getAdminSummary(req, res) {
  try {
    const [
      usersResult,
      restaurantsResult,
      ordersResult,
      reservationsResult,
      revenueResult,
      recentOrdersResult,
      recentUsersResult,
    ] = await Promise.all([
      pool.query("SELECT role, COUNT(*)::int AS count FROM users GROUP BY role"),
      pool.query("SELECT COUNT(*)::int AS count FROM restaurants"),
      pool.query("SELECT status, COUNT(*)::int AS count FROM orders GROUP BY status"),
      pool.query("SELECT status, COUNT(*)::int AS count FROM reservations GROUP BY status"),
      pool.query("SELECT COALESCE(SUM(total_price), 0)::numeric AS total FROM orders WHERE payment_status = 'paid'"),
      pool.query(
        `SELECT o.id, o.status, o.payment_status, o.total_price, o.created_at, r.name AS restaurant_name, u.name AS customer_name
         FROM orders o
         LEFT JOIN restaurants r ON o.restaurant_id = r.id
         LEFT JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC
         LIMIT 6`
      ),
      pool.query("SELECT id, name, email, role FROM users ORDER BY id DESC LIMIT 6"),
    ]);

    const usersByRole = usersResult.rows.reduce((summary, row) => {
      summary[row.role] = row.count;
      return summary;
    }, {});

    const ordersByStatus = ordersResult.rows.reduce((summary, row) => {
      summary[row.status] = row.count;
      return summary;
    }, {});

    const reservationsByStatus = reservationsResult.rows.reduce((summary, row) => {
      summary[row.status] = row.count;
      return summary;
    }, {});

    res.json({
      usersByRole,
      restaurants: restaurantsResult.rows[0]?.count || 0,
      ordersByStatus,
      reservationsByStatus,
      paidRevenue: revenueResult.rows[0]?.total || 0,
      recentOrders: recentOrdersResult.rows,
      recentUsers: recentUsersResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load admin summary." });
  }
}

export async function getUsers(req, res) {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load users." });
  }
}

export async function getRestaurants(req, res) {
  try {
    const result = await pool.query(
      `SELECT r.id, r.name, r.location, r.category, r.rating, u.name AS owner_name
       FROM restaurants r
       LEFT JOIN users u ON r.owner_id = u.id
       ORDER BY r.name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load restaurants." });
  }
}

export async function assignRole(req, res) {
  const { role } = req.body;

  if (!isAllowedValue(role, adminAssignableRoles)) {
    return res.status(400).json({ message: "Role must be customer, owner, or admin." });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user role." });
  }
}
