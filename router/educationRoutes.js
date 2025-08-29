import express from "express";
import {
  postEducation,
  getAllEducations,
  deleteEducation,
} from "../controller/educationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// ------------------ EDUCATION ROUTES ------------------

// Create a new education entry (Protected)
router.post("/", isAuthenticated, postEducation);

// Get all education entries (Public)
router.get("/", getAllEducations);

// Delete an education entry by ID (Protected)
router.delete("/:id", isAuthenticated, deleteEducation);

export default router;
