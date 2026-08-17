import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { contactEmailTemplate } from "../utils/emailTemplates.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(" Email configuration failed:", error);
  } else {
    console.log(" Email configured successfully!");
  }
});

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }
    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const unread = await Contact.countDocuments({ status: "unread" });
    const read = await Contact.countDocuments({ status: "read" });
    res.status(200).json({
      success: true,
      data: { total, unread, read },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    const adminTemplate = contactEmailTemplate(contact);
    const userTemplate = contactEmailTemplate(contact);

    await transporter.sendMail({
      from: `"Son Pratap Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: adminTemplate.adminSubject,
      html: adminTemplate.adminHtml,
    });

    await transporter.sendMail({
      from: `"Son Pratap" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: userTemplate.userSubject,
      html: userTemplate.userHtml,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll contact you soon.",
      data: contact,
    });
  } catch (err) {
    console.log(" Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};