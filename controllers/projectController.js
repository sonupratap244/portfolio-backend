import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

// Upload file to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio/projects",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
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
    const data = req.body;

    // Upload image to Cloudinary
    if (req.file) {
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
    console.log("Create Project Error:", err);

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

    const data = req.body;

    // If new image selected
    if (req.file) {
      const result = await uploadToCloudinary(req.file);

      data.image = result.secure_url;
    }

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
    console.log("Update Project Error:", err);

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

    /*
      Cloudinary image deletion can be added here later
      using the public_id.

      For now, deleting the MongoDB project is enough.
    */

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.log("Delete Project Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};