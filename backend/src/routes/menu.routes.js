import express from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  updateMenuItem,
} from "../controllers/menu.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/restaurants/:restaurantId/menu", getMenuItems);
router.post("/restaurants/:restaurantId/menu", authenticateToken, authorizeRoles("owner"), createMenuItem);
router.put("/menu/:id", authenticateToken, authorizeRoles("owner"), updateMenuItem);
router.delete("/menu/:id", authenticateToken, authorizeRoles("owner"), deleteMenuItem);

export default router;
