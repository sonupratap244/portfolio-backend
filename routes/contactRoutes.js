import express from "express";
import {
  getContacts,
  getContactById,
  createContact,
  updateContactStatus,
  deleteContact,
  getContactStats,
} from "../controllers/contactController.js";

const router = express.Router();

router.get("/", getContacts);
router.get("/stats", getContactStats);
router.get("/:id", getContactById);
router.post("/", createContact);
router.put("/:id", updateContactStatus);
router.delete("/:id", deleteContact);

export default router;