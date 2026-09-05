import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Customer email is required"],
        trim: true,
        lowercase: true,
      },
      mobile: {
        type: String,
        required: [true, "Customer mobile is required"],
        trim: true,
      },
    },
    session: {
      date: {
        type: String,
        required: [true, "Session date is required"],
      },
      time: {
        type: String,
        required: [true, "Session time is required"],
      },
      duration: {
        type: Number,
        required: [true, "Session duration is required"],
        enum: [30, 45, 60],
        default: 30,
      },
      mode: {
        type: String,
        enum: ["video", "phone", "in-person"],
        default: "video",
      },
      message: {
        type: String,
        trim: true,
        default: "",
      },
    },
    pricing: {
      amount: {
        type: Number,
        required: [true, "Pricing amount is required"],
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
        uppercase: true,
      },
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "paid", "failed", "refunded"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ "customer.email": 1 });
bookingSchema.index({ "session.date": 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;