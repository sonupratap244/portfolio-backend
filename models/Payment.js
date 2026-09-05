import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    gateway: {
      type: String,
      enum: ["razorpay"],
      required: true,
      default: "razorpay",
    },

    gatewayOrderId: {
      type: String,
      default: null,
      index: true,
    },

    gatewayPaymentId: {
      type: String,
      default: null,
      index: true,
    },

    gatewaySignature: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      required: true,
      default: "INR",
      uppercase: true,
    },

    status: {
      type: String,
      enum: [
        "created",
        "processing",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      default: "created",
    },

    method: {
      type: String,
      default: null,
    },

    failureReason: {
      type: String,
      default: null,
    },

    refund: {
      amount: {
        type: Number,
        default: 0,
      },

      refundId: {
        type: String,
        default: null,
      },

      status: {
        type: String,
        enum: ["none", "processing", "completed", "failed"],
        default: "none",
      },
    },

    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ booking: 1, status: 1 });
paymentSchema.index({ gateway: 1, gatewayOrderId: 1 });
paymentSchema.index(
  { gateway: 1, gatewayPaymentId: 1 },
  { sparse: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;