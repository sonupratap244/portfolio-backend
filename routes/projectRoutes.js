import express from "express";
import multer from "multer";

import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// ===============================
// MULTER MEMORY STORAGE
// ===============================
// File disk par save nahi hogi.
// File directly memory mein buffer ke form mein milegi.
// Cloudinary ko buffer chahiye.
const storage = multer.memoryStorage();

// ===============================
// FILE FILTER
// ===============================
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// ===============================
// MULTER CONFIG
// ===============================
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

// ===============================
// GET ALL PROJECTS
// ===============================
router.get("/", getProjects);

// ===============================
// GET PROJECT BY ID
// ===============================
router.get("/:id", getProjectById);

// ===============================
// CREATE PROJECT
// ===============================
router.post("/", upload.single("image"), createProject);

// ===============================
// UPDATE PROJECT
// ===============================
router.put("/:id", upload.single("image"), updateProject);

// ===============================
// DELETE PROJECT
// ===============================
router.delete("/:id", deleteProject);

// ===============================
// MULTER ERROR HANDLER
// ===============================
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next(err);
});

export default router;