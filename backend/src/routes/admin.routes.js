import express from "express";
import {
  getUsers,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  assignRole,
} from "../controllers/admin.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken, authorizeRoles("admin"));

router.get("/users", getUsers);
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.put("/users/:id/role", assignRole);

export default router;
