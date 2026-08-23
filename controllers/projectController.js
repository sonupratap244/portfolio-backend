import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

// ===============================
// UPLOAD IMAGE TO CLOUDINARY
// ===============================
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer || file.buffer.length === 0) {
      return reject(new Error("File buffer is empty"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio/projects",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

// ===============================
// GET ALL PROJECTS
// ===============================
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (err) {
    console.error("Get Projects Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// GET PROJECT BY ID
// ===============================
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    console.error("Get Project By ID Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// CREATE PROJECT
// ===============================
export const createProject = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    // New image selected
    if (req.file) {
      console.log(
        "Create Image:",
        req.file.originalname,
        req.file.size,
        req.file.mimetype
      );

      const result = await uploadToCloudinary(req.file);

      data.image = result.secure_url;
    }

    const project = await Project.create(data);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    console.error("Create Project Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// UPDATE PROJECT
// ===============================
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const data = {
      ...req.body,
    };

    // =====================================
    // ONLY UPLOAD IF NEW IMAGE IS SELECTED
    // =====================================
    if (req.file) {
      console.log(
        "Update Image:",
        req.file.originalname,
        req.file.size,
        req.file.mimetype
      );

      const result = await uploadToCloudinary(req.file);

      data.image = result.secure_url;
    }

    // =====================================
    // IF NO NEW IMAGE
    // OLD IMAGE REMAINS UNCHANGED
    // =====================================
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (err) {
    console.error("Update Project Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// DELETE PROJECT
// ===============================
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("Delete Project Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};