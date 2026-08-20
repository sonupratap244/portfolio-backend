import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { contactEmailTemplate } from "../utils/emailTemplates.js";

dotenv.config();

/* =========================================================
   EMAIL CONFIGURATION
========================================================= */

console.log("📧 Initializing email transporter...");
console.log("📧 EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("📧 EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("📧 EMAIL_SECURE:", process.env.EMAIL_SECURE);
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
console.log("📧 EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "NOT SET");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",

  family: 4,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  requireTLS: Number(process.env.EMAIL_PORT) === 587,

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

/* =========================================================
   EMAIL CONNECTION TEST
========================================================= */

transporter.verify((error, success) => {
  if (error) {
    console.log("========================================");
    console.log("❌ EMAIL CONFIGURATION FAILED");
    console.log("========================================");
    console.log("❌ Error Code:", error.code);
    console.log("❌ Error Command:", error.command);
    console.log("❌ Error Message:", error.message);
    console.log("❌ Error Response:", error.response || "No response");
    console.log("❌ Error Response Code:", error.responseCode || "No response code");
    console.log("========================================");
  } else {
    console.log("========================================");
    console.log("✅ EMAIL SERVER CONNECTION SUCCESSFUL");
    console.log("========================================");
    console.log("📧 SMTP Host:", process.env.EMAIL_HOST);
    console.log("📧 SMTP Port:", process.env.EMAIL_PORT);
    console.log("📧 Secure:", process.env.EMAIL_SECURE);
    console.log("📧 Email:", process.env.EMAIL_USER);
    console.log("========================================");
  }
});

/* =========================================================
   GET ALL CONTACTS
========================================================= */

export const getContacts = async (req, res) => {
  try {
    console.log("📩 GET /api/contact");

    const contacts = await Contact.find().sort({ createdAt: -1 });

    console.log(`✅ Contacts fetched: ${contacts.length}`);

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (err) {
    console.log("❌ Error fetching contacts:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   GET CONTACT BY ID
========================================================= */

export const getContactById = async (req, res) => {
  try {
    console.log("📩 GET /api/contact/:id");
    console.log("🆔 Contact ID:", req.params.id);

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      console.log("❌ Contact not found");

      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    console.log("✅ Contact found:", contact._id);

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    console.log("❌ Error fetching contact:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   GET CONTACT STATS
========================================================= */

export const getContactStats = async (req, res) => {
  try {
    console.log("📊 GET /api/contact/stats");

    const total = await Contact.countDocuments();
    const unread = await Contact.countDocuments({
      status: "unread",
    });
    const read = await Contact.countDocuments({
      status: "read",
    });

    console.log("📊 Contact Stats:");
    console.log("   Total:", total);
    console.log("   Unread:", unread);
    console.log("   Read:", read);

    res.status(200).json({
      success: true,
      data: {
        total,
        unread,
        read,
      },
    });
  } catch (err) {
    console.log("❌ Error fetching contact stats:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   CREATE CONTACT
========================================================= */

export const createContact = async (req, res) => {
  console.log("========================================");
  console.log("📨 NEW CONTACT REQUEST");
  console.log("========================================");

  try {
    console.log("📥 Request body received");

    /* -----------------------------------------------------
       1. SAVE CONTACT TO DATABASE
    ----------------------------------------------------- */

    const contact = await Contact.create(req.body);

    console.log("✅ Contact saved to MongoDB");
    console.log("🆔 Contact ID:", contact._id);
    console.log("👤 Name:", contact.name);
    console.log("📧 User Email:", contact.email);

    /* -----------------------------------------------------
       2. CREATE EMAIL TEMPLATES
    ----------------------------------------------------- */

    console.log("📧 Creating email templates...");

    const adminTemplate = contactEmailTemplate(contact);
    const userTemplate = contactEmailTemplate(contact);

    console.log("✅ Email templates created");

    /* -----------------------------------------------------
       3. SEND EMAIL TO ADMIN
    ----------------------------------------------------- */

    console.log("----------------------------------------");
    console.log("📧 Sending email to ADMIN...");
    console.log("📧 From:", process.env.EMAIL_USER);
    console.log("📧 To:", process.env.EMAIL_USER);
    console.log("📧 Subject:", adminTemplate.adminSubject);

    try {
      const adminMail = await transporter.sendMail({
        from: `"Son Pratap Portfolio" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: adminTemplate.adminSubject,
        html: adminTemplate.adminHtml,
      });

      console.log("✅ ADMIN EMAIL SENT");
      console.log("📨 Message ID:", adminMail.messageId);
      console.log("📨 Response:", adminMail.response || "No response");
    } catch (emailError) {
      console.log("❌ ADMIN EMAIL FAILED");
      console.log("❌ Code:", emailError.code);
      console.log("❌ Command:", emailError.command);
      console.log("❌ Message:", emailError.message);
      console.log("❌ Response:", emailError.response || "No response");

      throw emailError;
    }

    /* -----------------------------------------------------
       4. SEND CONFIRMATION EMAIL TO USER
    ----------------------------------------------------- */

    console.log("----------------------------------------");
    console.log("📧 Sending confirmation email to USER...");
    console.log("📧 From:", process.env.EMAIL_USER);
    console.log("📧 To:", contact.email);
    console.log("📧 Subject:", userTemplate.userSubject);

    try {
      const userMail = await transporter.sendMail({
        from: `"Son Pratap" <${process.env.EMAIL_USER}>`,
        to: contact.email,
        subject: userTemplate.userSubject,
        html: userTemplate.userHtml,
      });

      console.log("✅ USER EMAIL SENT");
      console.log("📨 Message ID:", userMail.messageId);
      console.log("📨 Response:", userMail.response || "No response");
    } catch (emailError) {
      console.log("❌ USER EMAIL FAILED");
      console.log("❌ Code:", emailError.code);
      console.log("❌ Command:", emailError.command);
      console.log("❌ Message:", emailError.message);
      console.log("❌ Response:", emailError.response || "No response");

      throw emailError;
    }

    /* -----------------------------------------------------
       5. SUCCESS RESPONSE
    ----------------------------------------------------- */

    console.log("========================================");
    console.log("✅ CONTACT PROCESS COMPLETED SUCCESSFULLY");
    console.log("========================================");

    res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll contact you soon.",
      data: contact,
    });
  } catch (err) {
    console.log("========================================");
    console.log("❌ CONTACT PROCESS FAILED");
    console.log("========================================");
    console.log("❌ Error Code:", err.code);
    console.log("❌ Error Command:", err.command);
    console.log("❌ Error Message:", err.message);
    console.log("❌ Error Response:", err.response || "No response");
    console.log("❌ Error Response Code:", err.responseCode || "No response code");
    console.log("========================================");

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   UPDATE CONTACT STATUS
========================================================= */

export const updateContactStatus = async (req, res) => {
  try {
    console.log("📝 PUT /api/contact/:id");
    console.log("🆔 Contact ID:", req.params.id);
    console.log("📌 New Status:", req.body.status);

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contact) {
      console.log("❌ Contact not found");

      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    console.log("✅ Contact status updated");
    console.log("🆔 Contact ID:", contact._id);
    console.log("📌 Status:", contact.status);

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: contact,
    });
  } catch (err) {
    console.log("❌ Error updating contact status:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   DELETE CONTACT
========================================================= */

export const deleteContact = async (req, res) => {
  try {
    console.log("🗑️ DELETE /api/contact/:id");
    console.log("🆔 Contact ID:", req.params.id);

    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      console.log("❌ Contact not found");

      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    console.log("✅ Contact deleted");
    console.log("🆔 Deleted Contact ID:", contact._id);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (err) {
    console.log("❌ Error deleting contact:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};