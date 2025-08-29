import express from "express";
import {
  addNewProject,
  deleteProject,
  updateProject,
  getSingleProject,
  getAllProjects,
} from "../controller/projectController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// ------------------ PROJECT ROUTES ------------------

// add a new project (Protected)
router.post("/", isAuthenticated, addNewProject);

// Delete a project by ID (Protected)
router.delete("/:id", isAuthenticated, deleteProject);

// Update project by ID (Protected)
router.put("/:id", isAuthenticated, updateProject);

// get a project by ID (Protected)
router.get("/:id", getSingleProject);

// Get all projects (Public)
router.get("/", getAllProjects);

export default router;
