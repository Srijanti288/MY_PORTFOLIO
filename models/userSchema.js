import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// ------------------ User Schema ------------------
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // prevents duplicate emails
      lowercase: true, // always stored in lowercase
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    aboutMe: {
      type: String,
      required: [true, "About Me section is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"], // ✅ lowercase "minlength"
      select: false, // password is never returned in queries
    },
    avatar: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    resume: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    portfolioURL: {
      type: String,
      required: [true, "Portfolio URL is required"],
    },
    githubURL: String,
    instagramURL: String,
    twitterURL: String,
    linkedInURL: String,
    facebookURL: String,

    // Reset password fields
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// ------------------ Middleware ------------------
/**
 * Hash the password before saving the user document.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ------------------ Instance Methods ------------------
/**
 * Compare entered password with hashed password.
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!enteredPassword) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate JWT Token for authentication.
 */
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES || "7d" } // fallback to 7 days
  );
};

/**
 * Generate and hash password reset token.
 */
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set it to schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token valid for 15 minutes
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

// ------------------ Export Model ------------------
export const User = mongoose.model("User", userSchema);
