import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Education title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Education description is required"],
      trim: true,
    },
    education: {
      from: {
        type: String,
        required: [true, "Education start date is required"],
        trim: true,
      },
      to: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

export const Education = mongoose.model("Education", educationSchema);
