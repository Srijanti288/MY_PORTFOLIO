import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
import { v2 as cloudinary } from "cloudinary";

// ------------------ ADD NEW SOFTWARE APPLICATION ------------------
export const addNewApplication = catchAsyncError(async (req, res, next) => {
  if (!req.files || !req.files.svg) {
    return next(
      new ErrorHandler("Software application icon/image is required", 400)
    );
  }

  const { name } = req.body;
  const { svg } = req.files;

  if (!name) {
    return next(new ErrorHandler("Please provide the application's name", 400));
  }

  // Upload to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(svg.tempFilePath, {
    folder: "PORTFOLIO_SOFTWARE_APPLICATION_IMAGES",
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown");
    return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
  }

  const softwareApplication = await SoftwareApplication.create({
    name,
    svg: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "New software application added successfully",
    softwareApplication,
  });
});

// ------------------ DELETE SOFTWARE APPLICATION ------------------
export const deleteApplication = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const softwareApplication = await SoftwareApplication.findById(id);
  if (!softwareApplication) {
    return next(new ErrorHandler("Software application not found", 404));
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(softwareApplication.svg.public_id);

  await softwareApplication.deleteOne();

  res.status(200).json({
    success: true,
    message: "Software application deleted successfully",
  });
});

// ------------------ GET ALL SOFTWARE APPLICATIONS ------------------
export const getAllApplications = catchAsyncError(async (req, res, next) => {
  const softwareApplications = await SoftwareApplication.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: softwareApplications.length,
    softwareApplications,
  });
});
