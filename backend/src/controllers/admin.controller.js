import pool from "../db.js";

export async function getUsers(req, res) {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load users." });
  }
}

export async function getCategories(req, res) {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load categories." });
  }
}

export async function createCategory(req, res) {
  const { name } = req.body;
  try {
    const result = await pool.query("INSERT INTO categories (name) VALUES ($1) RETURNING *", [name]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create category." });
  }
}

export async function updateCategory(req, res) {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
      [name, req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update category." });
  }
}

export async function deleteCategory(req, res) {
  try {
    const result = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING *", [req.params.id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.json({ message: "Category deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete category." });
  }
}

export async function assignRole(req, res) {
  const { role } = req.body;
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
