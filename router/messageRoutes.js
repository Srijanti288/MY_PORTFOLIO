import express from "express";

// messageControllers
import {
  sendMessage,
  getAllMessages,
  getMessageById,
  deleteMessage,
} from "../controller/messageController.js";

// Middlewares
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// ------------------ ROUTES ------------------

// Send a new message
router.post("/send", sendMessage);

// Get all messages
router.get("/getall", getAllMessages);

// Get a single message by ID
router.get("/:id", getMessageById);

// Delete a message (requires authentication)
router.delete("/delete/:id", isAuthenticated, deleteMessage);

export default router;
