import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
      minLength: [2, "Name must contain at least 2 characters!"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minLength: [2, "Subject must contain at least 2 characters!"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minLength: [2, "Message must contain at least 2 characters!"],
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

export const Message = mongoose.model("Message", messageSchema);
