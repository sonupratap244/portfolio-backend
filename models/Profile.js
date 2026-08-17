import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // Personal Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    aboutDescription: {
      type: String,
      default: "",
    },

    // Images
    profileImage: {
      type: String,
      default: "",
    },

    heroImage: {
      type: String,
      default: "",
    },

    aboutImage: {
      type: String,
      default: "",
    },

    // Resume
    resume: {
      type: String,
      default: "",
    },

    // Social Links
    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    // Optional
    instagram: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    youtube: {
      type: String,
      default: "",
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema);