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


const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};


const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});


router.get("/", getProjects);


router.get("/:id", getProjectById);


router.post("/", upload.single("image"), createProject);


router.put("/:id", upload.single("image"), updateProject);


router.delete("/:id", deleteProject);


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