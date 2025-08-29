import express from "express";
import {
  addNewApplication,
  getAllApplications,
  deleteApplication,
} from "../controller/softwareApplicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// ------------------ SOFTWARE APPLICATION ROUTES ------------------

// Create a new software application (Protected)
router.post("/", isAuthenticated, addNewApplication);

// Get all software applications (Public)
router.get("/", getAllApplications);

// Delete a software application by ID (Protected)
router.delete("/:id", isAuthenticated, deleteApplication);

export default router;
