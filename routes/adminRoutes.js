import express from "express";
import {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  logoutAdmin,
  getAdminStats,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", logoutAdmin);
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateAdminProfile);
router.put("/change-password", protectAdmin, changePassword);
router.get("/stats", protectAdmin, getAdminStats);

export default router;