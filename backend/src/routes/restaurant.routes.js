import express from "express";
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", authenticateToken, authorizeRoles("owner", "admin"), createRestaurant);
router.put("/:id", authenticateToken, authorizeRoles("owner", "admin"), updateRestaurant);
router.delete("/:id", authenticateToken, authorizeRoles("owner", "admin"), deleteRestaurant);

export default router;
