import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("owner", "admin"), getOrders);
router.get("/:id", authenticateToken, getOrderById);
router.post("/", authenticateToken, createOrder);
router.put("/:id/status", authenticateToken, authorizeRoles("owner", "admin"), updateOrderStatus);

export default router;
