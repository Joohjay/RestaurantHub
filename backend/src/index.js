import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import { env } from "./config/env.js";
import { securityHeaders } from "./middleware/security.middleware.js";
import pool from "./db.js";

pool.query("SELECT NOW()")
  .then(res => console.log("DB Connected:", res.rows[0]))
  .catch(err => console.error("DB Error:", err));

const app = express();

app.use(securityHeaders);
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => res.json({ message: "DineHub API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);

app.listen(env.port, () => {
  console.log(`DineHub backend listening on port ${env.port}`);
});
