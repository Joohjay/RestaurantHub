import express from "express";
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
} from "../controllers/reservation.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, getReservations);
router.get("/:id", authenticateToken, getReservationById);
router.post("/", authenticateToken, createReservation);
router.put("/:id", authenticateToken, authorizeRoles("owner"), updateReservation);

export default router;
