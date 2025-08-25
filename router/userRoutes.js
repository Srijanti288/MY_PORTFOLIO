import express from "express";
import {
  register,
  login,
  logout,
  getUser,
  getUserForPortfolio,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
} from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// ------------------ AUTH ROUTES ------------------
router.post("/register", register);             // Register new user
router.post("/login", login);                   // Login user
router.get("/logout", isAuthenticated, logout); // Logout user

// ------------------ PROFILE ROUTES ------------------
router.get("/me", isAuthenticated, getUser);           // Get logged-in user profile
router.put("/update/me", isAuthenticated, updateProfile); // Update profile info
router.put("/update/password", isAuthenticated, updatePassword); // Update password

// ------------------ PUBLIC ROUTES ------------------
router.get("/me/portfolio", getUserForPortfolio); // Public portfolio data

// ------------------ PASSWORD RESET ROUTES ------------------
router.post("/password/forgot", forgotPassword);        // Forgot password - send email
router.put("/password/reset/:token", resetPassword);    // Reset password using token



export default router;
