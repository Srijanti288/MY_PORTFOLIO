import mongoose from "mongoose";

const softwareApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Application name is required"],
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
  { timestamps: true } // automatically adds createdAt & updatedAt
);

export const SoftwareApplication = mongoose.model(
  "SoftwareApplication",
  softwareApplicationSchema
);
