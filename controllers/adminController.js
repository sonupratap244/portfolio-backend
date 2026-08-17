import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "sonpratapportfolio", {
    expiresIn: "30d",
  });
};

export const adminLogin = async (req, res) => {
  try {
    console.log("🔐 Login attempt started");
    const { email, password } = req.body;
    console.log("📧 Email:", email);

    if (!email || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    console.log("🔍 Searching admin in database...");
    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log("❌ Admin not found with email:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("✅ Admin found:", admin.email);
    console.log("🔑 Comparing password...");

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔐 Password match:", isMatch ? "✅ Yes" : "❌ No");

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("✅ Password matched successfully!");
    console.log("🔄 Updating login attempts and last login...");

    admin.loginAttempts = 0;
    admin.lockUntil = null;
    admin.lastLogin = new Date();
    await admin.save();

    console.log("📝 Generating JWT token...");
    const token = generateToken(admin._id);
    console.log("✅ Token generated successfully");

    console.log("🎉 Login successful for:", admin.email);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (err) {
    console.log("❌ Login error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    console.log("🚪 Logout attempt");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log("❌ Logout error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    console.log("👤 Fetching admin profile");
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      console.log("❌ Admin not found");
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    console.log("✅ Profile fetched for:", admin.email);
    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    console.log("❌ Profile fetch error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    console.log("📝 Updating admin profile");
    const { name, email } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      console.log("❌ Admin not found");
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (email && email !== admin.email) {
      console.log("📧 Checking if email exists:", email);
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        console.log("❌ Email already in use");
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
      admin.email = email;
    }

    if (name) admin.name = name;
    await admin.save();

    console.log("✅ Profile updated for:", admin.email);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err) {
    console.log("❌ Profile update error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    console.log("🔑 Password change request");
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      console.log("❌ Missing passwords");
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    if (newPassword.length < 6) {
      console.log("❌ Password too short");
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      console.log("❌ Admin not found");
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    console.log("🔐 Verifying current password...");
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      console.log("❌ Current password incorrect");
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    console.log("✅ Current password verified");
    console.log("🔑 Hashing new password...");

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    console.log("✅ Password changed successfully");
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.log("❌ Password change error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    console.log("📊 Fetching admin stats");
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      },
    });
  } catch (err) {
    console.log("❌ Stats fetch error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};