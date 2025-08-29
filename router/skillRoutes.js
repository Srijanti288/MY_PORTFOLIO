import express from "express";
import {
  addNewSkill,
  deleteSkill,
  updateSkill,
  getAllSkills,
} from "../controller/skillController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// ------------------ SKILL ROUTES ------------------

// Create a new skill (Protected)
router.post("/", isAuthenticated, addNewSkill);

// Delete a skill by ID (Protected)
router.delete("/:id", isAuthenticated, deleteSkill);

// Update a skill by ID (Protected)
router.put("/:id", isAuthenticated, updateSkill);

// Get all skills (Public)
router.get("/", getAllSkills);

export default router;
