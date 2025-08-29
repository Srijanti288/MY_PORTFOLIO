import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Project } from "../models/projectSchema.js";
import { v2 as cloudinary } from "cloudinary";

// ------------------ ADD NEW PROJECT ------------------
export const addNewProject = catchAsyncError(async (req, res, next) => {
  if (!req.files || !req.files.projectBanner) {
    return next(new ErrorHandler("Project banner image is required", 400));
  }

  const { projectBanner } = req.files;
  const { title, description, gitRepoLink, projectLink, stack, technologies, deployed } = req.body;

  if (!title || !description || !gitRepoLink || !projectLink || !stack || !technologies) {
    return next(new ErrorHandler("Please provide all project details", 400));
  }

  // Upload banner to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(projectBanner.tempFilePath, {
    folder: "PORTFOLIO_PROJECT_IMAGES",
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown");
    return next(new ErrorHandler("Failed to upload project banner", 500));
  }

  const project = await Project.create({
    title,
    description,
    gitRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
    projectBanner: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Project added successfully",
    project,
  });
});

// ------------------ UPDATE PROJECT ------------------
export const updateProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let project = await Project.findById(id);
  if (!project) return next(new ErrorHandler("Project not found", 404));

  const updatedData = {
    title: req.body.title || project.title,
    description: req.body.description || project.description,
    stack: req.body.stack || project.stack,
    technologies: req.body.technologies || project.technologies,
    deployed: req.body.deployed || project.deployed,
    projectLink: req.body.projectLink || project.projectLink,
    gitRepoLink: req.body.gitRepoLink || project.gitRepoLink,
  };

  // Update banner if new file is uploaded
  if (req.files && req.files.projectBanner) {
    const newBanner = req.files.projectBanner;

    // Delete old banner from Cloudinary
    await cloudinary.uploader.destroy(project.projectBanner.public_id);

    // Upload new banner
    const cloudinaryResponse = await cloudinary.uploader.upload(newBanner.tempFilePath, {
      folder: "PORTFOLIO_PROJECT_IMAGES",
    });

    updatedData.projectBanner = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  project = await Project.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project,
  });
});

// ------------------ DELETE PROJECT ------------------
export const deleteProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const project = await Project.findById(id);
  if (!project) return next(new ErrorHandler("Project not found", 404));

  // Delete banner from Cloudinary
  await cloudinary.uploader.destroy(project.projectBanner.public_id);

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});

// ------------------ GET ALL PROJECTS ------------------
export const getAllProjects = catchAsyncError(async (req, res, next) => {
  const projects = await Project.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    projects,
  });
});

// ------------------ GET SINGLE PROJECT ------------------
export const getSingleProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const project = await Project.findById(id);
  if (!project) return next(new ErrorHandler("Project not found", 404));

  res.status(200).json({
    success: true,
    project,
  });
});
