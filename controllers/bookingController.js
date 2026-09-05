import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import mongoose from "mongoose";

export const createBooking = async (req, res) => {
  try {
    const { customer, session, pricing } = req.body;

    if (!customer || !session || !pricing) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: customer, session, or pricing",
      });
    }

    if (!customer.name || !customer.email || !customer.mobile) {
      return res.status(400).json({
        success: false,
        message: "Customer name, email and mobile are required",
      });
    }

    if (!session.date || !session.time || !session.duration) {
      return res.status(400).json({
        success: false,
        message: "Session date, time and duration are required",
      });
    }

    if (!pricing.amount) {
      return res.status(400).json({
        success: false,
        message: "Pricing amount is required",
      });
    }

    const booking = await Booking.create({
      customer: {
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
      },
      session: {
        date: session.date,
        time: session.time,
        duration: session.duration,
        mode: session.mode || "video",
        message: session.message || "",
      },
      pricing: {
        amount: pricing.amount,
        currency: pricing.currency || "INR",
      },
      bookingStatus: "pending",
      paymentStatus: "pending",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .filter(b => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.pricing.amount, 0);

    const pendingPayments = bookings.filter(b => b.paymentStatus === "pending").length;
    const paidBookings = bookings.filter(b => b.paymentStatus === "paid").length;

    res.status(200).json({
      success: true,
      data: {
        bookings,
        stats: {
          totalBookings,
          totalRevenue,
          pendingPayments,
          paidBookings,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings",
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch booking",
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const validStatuses = ["pending", "confirmed", "completed", "cancelled", "expired"];
    if (!validStatuses.includes(bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { bookingStatus },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update booking",
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await Payment.deleteOne({ booking: id });

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete booking",
    });
  }
};

export const getBookingPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const payment = await Payment.findOne({ booking: bookingId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found for this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payment details",
    });
  }
};