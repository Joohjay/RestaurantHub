import express from "express";
import {
  assignRole,
  getAdminSummary,
  getRestaurants,
  getUsers,
  getOwners,
  getCustomers,
  getMenuItems,
} from "../controllers/admin.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken, authorizeRoles("admin"));

router.get("/summary", getAdminSummary);
router.get("/users", getUsers);
router.get("/owners", getOwners);
router.get("/customers", getCustomers);
router.get("/restaurants", getRestaurants);
router.get("/menus", getMenuItems);
router.put("/users/:id/role", assignRole);

export default router;
