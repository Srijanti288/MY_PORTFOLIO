import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Skill title is required"],
      trim: true,
    },
    proficiency: {
      type: String,
      required: [true, "Proficiency level is required"],
      trim: true,
    },
    svg: {
      public_id: {
        type: String,
        required: [true, "SVG public_id is required"],
      },
      url: {
        type: String,
        required: [true, "SVG URL is required"],
      },
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

export const Skill = mongoose.model("Skill", skillSchema);
