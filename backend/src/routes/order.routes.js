import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  processPayment,
} from "../controllers/order.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, getOrders);
router.get("/:id", authenticateToken, getOrderById);
router.post("/", authenticateToken, createOrder);
router.put("/:id/status", authenticateToken, authorizeRoles("owner", "admin"), updateOrderStatus);
router.post("/:id/payment", authenticateToken, processPayment);

export default router;
