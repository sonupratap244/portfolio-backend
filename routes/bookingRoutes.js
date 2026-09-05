import express from "express";
import {
  createBooking,
  getAdminBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getBookingPayment,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/admin", getAdminBookings);
router.get("/admin/:id", getBookingById);
router.put("/admin/:id/status", updateBookingStatus);
router.delete("/admin/:id", deleteBooking);
router.get("/admin/:bookingId/payment", getBookingPayment);

export default router;