import express from "express";
import multer from "multer";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  uploadHeroImage,
  uploadAboutImage,
  uploadResume,
} from "../controllers/profileController.js";

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Only PDF, DOC, DOCX files are allowed for resume"),
        false
      );
    }
  } else {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter,
});

router.get("/", getProfile);
router.put("/", updateProfile);

router.post(
  "/upload/profile",
  upload.single("image"),
  uploadProfileImage
);

router.post(
  "/upload/hero",
  upload.single("image"),
  uploadHeroImage
);

router.post(
  "/upload/about",
  upload.single("image"),
  uploadAboutImage
);

router.post(
  "/upload/resume",
  upload.single("resume"),
  uploadResume
);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 10MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(400).json({
    success: false,
    message: err.message,
  });
});

export default router;