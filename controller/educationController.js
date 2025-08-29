import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Education } from "../models/educationSchema.js";

// ------------------ ADD NEW EDUCATION ------------------
export const postEducation = catchAsyncError(async (req, res, next) => {
  const { title, description, from, to } = req.body;

  if (!title || !description || !from) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const newEducation = await Education.create({
    title,
    description,
    education: { from, to },
  });

  res.status(201).json({
    success: true,
    message: "Education added successfully",
    education: newEducation,
  });
});

// ------------------ DELETE EDUCATION ------------------
export const deleteEducation = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const education = await Education.findById(id);
  if (!education) {
    return next(new ErrorHandler("Education not found", 404));
  }

  await education.deleteOne();

  res.status(200).json({
    success: true,
    message: "Education deleted successfully",
  });
});

// ------------------ GET ALL EDUCATIONS ------------------
export const getAllEducations = catchAsyncError(async (req, res, next) => {
  const educations = await Education.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: educations.length,
    educations,
  });
});
