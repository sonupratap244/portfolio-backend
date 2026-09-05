import Booking from "../models/Booking.js";

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