import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { changePassword, login, register, me, updateProfile, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authenticateToken, me);
router.put("/me", authenticateToken, updateProfile);
router.put("/password", authenticateToken, changePassword);

export default router;
