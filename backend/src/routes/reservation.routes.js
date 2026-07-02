import express from "express";
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
} from "../controllers/reservation.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("owner", "admin"), getReservations);
router.get("/:id", authenticateToken, getReservationById);
router.post("/", authenticateToken, createReservation);
router.put("/:id", authenticateToken, authorizeRoles("owner", "admin"), updateReservation);

export default router;
