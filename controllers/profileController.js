import Profile from "../models/Profile.js";
import fs from 'fs';
import path from 'path';

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
  }
  catch (err) {
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
    }
    else {
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
  }
  catch (err) {
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
        message: "No file uploaded. Please select an image."
      });
    }

    let profile = await Profile.findOne();
    
    if (!profile) {
      profile = await Profile.create({
        profileImage: req.file.filename,
      });
    } else {
      if (profile.profileImage) {
        const oldImagePath = path.join('uploads/profile', profile.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      profile.profileImage = req.file.filename;
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
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({
        heroImage: req.file.filename,
      });
    }
    else {
      profile.heroImage = req.file.filename;
      await profile.save();
    }
    res.status(200).json({
      success: true,
      message: "Hero Image Uploaded",
      image: profile.heroImage,
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const uploadAboutImage = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({
        aboutImage: req.file.filename,
      });
    }
    else {
      profile.aboutImage = req.file.filename;
      await profile.save();
    }
    res.status(200).json({
      success: true,
      message: "About Image Uploaded",
      image: profile.aboutImage,
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const uploadResume = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({
        resume: req.file.filename,
      });
    }
    else {
      profile.resume = req.file.filename;
      await profile.save();
    }
    res.status(200).json({
      success: true,
      message: "Resume Uploaded Successfully",
      resume: profile.resume,
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};