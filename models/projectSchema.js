import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    gitRepoLink: {
      type: String,
      trim: true,
    },
    projectLink: {
      type: String,
      trim: true,
    },
    technologies: {
      type: String,
      trim: true,
    },
    stack: {
      type: String,
      trim: true,
    },
    deployed: {
      type: String,
      trim: true,
      default: "No", // optional default value
    },
    projectBanner: {
      public_id: {
        type: String,
        required: [true, "Project banner public_id is required"],
      },
      url: {
        type: String,
        required: [true, "Project banner URL is required"],
      },
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

export const Project = mongoose.model("Project", projectSchema);
