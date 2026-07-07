import pool from "./src/db.js";

async function main() {
  const result = await pool.query(
    `SELECT mi.id, mi.name, r.name AS restaurant_name, mi.image
     FROM menu_items mi
     JOIN restaurants r ON mi.restaurant_id = r.id
     ORDER BY r.id, mi.id`
  );
  result.rows.forEach((m) => {
    console.log(`${m.id}|${m.restaurant_name}|${m.name}|${m.image || ''}`);
  });
  await pool.end();
}

main();
