import express from "express";
import {
  getRestaurants,
  getRestaurantById,
  getOwnerRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getRestaurants);
router.get("/owner/mine", authenticateToken, authorizeRoles("owner"), getOwnerRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", authenticateToken, authorizeRoles("owner"), createRestaurant);
router.put("/:id", authenticateToken, authorizeRoles("owner"), updateRestaurant);
router.delete("/:id", authenticateToken, authorizeRoles("owner"), deleteRestaurant);

export default router;
