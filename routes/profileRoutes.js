import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  uploadHeroImage,
  uploadAboutImage,
  uploadResume,
} from "../controllers/profileController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const ensureFolderExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

ensureFolderExists('uploads');
ensureFolderExists('uploads/profile');
ensureFolderExists('uploads/hero');
ensureFolderExists('uploads/about');
ensureFolderExists('uploads/resume');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/";
    
    if (req.path.includes("profile")) {
      folder += "profile";
    } else if (req.path.includes("hero")) {
      folder += "hero";
    } else if (req.path.includes("about")) {
      folder += "about";
    } else if (req.path.includes("resume")) {
      folder += "resume";
    }
    
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.originalname;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX files are allowed for resume'), false);
    }
  } else {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
};

const upload = multer({ 
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024
  },
  fileFilter
});

router.get("/", getProfile);
router.put("/", updateProfile);

router.post("/upload/profile", upload.single("image"), uploadProfileImage);
router.post("/upload/hero", upload.single("image"), uploadHeroImage);
router.post("/upload/about", upload.single("image"), uploadAboutImage);
router.post("/upload/resume", upload.single("resume"), uploadResume);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next(err);
});

export default router;