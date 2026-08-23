import Profile from "../models/Profile.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (file, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `portfolio/${folder}`,
        resource_type: resourceType,
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

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      profile = await Profile.findByIdAndUpdate(
        profile._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an image.",
      });
    }

    const result = await uploadToCloudinary(
      req.file,
      "profile",
      "image"
    );

    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create({
        profileImage: result.secure_url,
      });
    } else {
      profile.profileImage = result.secure_url;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile Image Uploaded Successfully",
      image: profile.profileImage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const uploadHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an image.",
      });
    }

    const result = await uploadToCloudinary(
      req.file,
      "hero",
      "image"
    );

    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create({
        heroImage: result.secure_url,
      });
    } else {
      profile.heroImage = result.secure_url;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: "Hero Image Uploaded Successfully",
      image: profile.heroImage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const uploadAboutImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an image.",
      });
    }

    const result = await uploadToCloudinary(
      req.file,
      "about",
      "image"
    );

    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create({
        aboutImage: result.secure_url,
      });
    } else {
      profile.aboutImage = result.secure_url;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: "About Image Uploaded Successfully",
      image: profile.aboutImage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume uploaded. Please select a file.",
      });
    }

    const result = await uploadToCloudinary(
      req.file,
      "resume",
      "raw"
    );

    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create({
        resume: result.secure_url,
      });
    } else {
      profile.resume = result.secure_url;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: "Resume Uploaded Successfully",
      resume: profile.resume,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};