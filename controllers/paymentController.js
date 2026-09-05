import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import getRazorpayClient from "../config/razorpay.js";
import crypto from "crypto";

export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This booking is already paid",
      });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This booking has been cancelled",
      });
    }

    if (booking.expiresAt && new Date(booking.expiresAt) < new Date()) {
      booking.bookingStatus = "expired";
      await booking.save();
      return res.status(400).json({
        success: false,
        message: "This booking has expired. Please create a new booking.",
      });
    }

    const existingPayment = await Payment.findOne({
      booking: booking._id,
      status: { $in: ["created", "processing"] },
    }).sort({ createdAt: -1 });

    if (existingPayment?.gatewayOrderId) {
      return res.status(200).json({
        success: true,
        message: "Existing payment order found",
        data: {
          paymentId: existingPayment._id,
          bookingId: booking._id,
          orderId: existingPayment.gatewayOrderId,
          amount: booking.pricing.amount * 100,
          currency: booking.pricing.currency,
          key: process.env.RAZORPAY_KEY_ID,
        },
      });
    }

    const amount = Math.round(booking.pricing.amount * 100);
    const razorpay = getRazorpayClient();

    const order = await razorpay.orders.create({
      amount,
      currency: booking.pricing.currency || "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        customerName: booking.customer.name,
        customerEmail: booking.customer.email,
      },
    });

    const payment = await Payment.create({
      booking: booking._id,
      gateway: "razorpay",
      gatewayOrderId: order.id,
      amount: booking.pricing.amount,
      currency: booking.pricing.currency || "INR",
      status: "created",
    });

    booking.paymentStatus = "processing";
    await booking.save();

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully",
      data: {
        paymentId: payment._id,
        bookingId: booking._id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    if (error.statusCode === 401) {
      return res.status(401).json({
        success: false,
        message: "Razorpay authentication failed. Please check your API keys.",
        details: error.error?.description || error.message,
      });
    }

    if (error.error?.code === "BAD_REQUEST_ERROR") {
      return res.status(400).json({
        success: false,
        message: error.error.description || "Invalid request to Razorpay",
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.error?.description || error.message || "Failed to create payment order",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !bookingId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const payment = await Payment.findOne({
      booking: booking._id,
      gatewayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      payment.status = "failed";
      payment.failureReason = "Invalid payment signature";

      await payment.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    payment.gatewayPaymentId = razorpay_payment_id;
    payment.gatewaySignature = razorpay_signature;
    payment.status = "paid";
    payment.method = "razorpay";

    await payment.save();

    booking.paymentStatus = "paid";
    booking.bookingStatus = "confirmed";

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        bookingId: booking._id,
        paymentId: payment._id,
        orderId: razorpay_order_id,
        paymentIdFromGateway: razorpay_payment_id,
        status: "paid",
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};