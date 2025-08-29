import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Skill } from "../models/skillSchema.js";
import { v2 as cloudinary } from "cloudinary";

// ------------------ ADD NEW SKILL ------------------
export const addNewSkill = catchAsyncError(async (req, res, next) => {
  if (!req.files || !req.files.svg) {
    return next(new ErrorHandler("Skill image is required!", 400));
  }

  const { title, proficiency } = req.body;
  const { svg } = req.files;

  if (!title || !proficiency) {
    return next(new ErrorHandler("Please provide title and proficiency!", 400));
  }

  // Upload to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(svg.tempFilePath, {
    folder: "PORTFOLIO_SKILL_IMAGES",
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown");
    return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
  }

  const skill = await Skill.create({
    title,
    proficiency,
    svg: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "New skill added successfully",
    skill,
  });
});

// ------------------ DELETE SKILL ------------------
export const deleteSkill = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const skill = await Skill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill not found or already deleted", 404));
  }

  // Delete image from Cloudinary
  await cloudinary.uploader.destroy(skill.svg.public_id);

  await skill.deleteOne();

  res.status(200).json({
    success: true,
    message: "Skill deleted successfully",
  });
});

// ------------------ UPDATE SKILL ------------------
export const updateSkill = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, proficiency } = req.body;

  let skill = await Skill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill not found!", 404));
  }

  // Update only provided fields
  if (title) skill.title = title;
  if (proficiency) skill.proficiency = proficiency;

  await skill.save();

  res.status(200).json({
    success: true,
    message: "Skill updated successfully",
    skill,
  });
});

// ------------------ GET ALL SKILLS ------------------
export const getAllSkills = catchAsyncError(async (req, res, next) => {
  const skills = await Skill.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: skills.length,
    skills,
  });
});
