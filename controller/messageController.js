import { Message } from "../models/messageSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

// @desc    Send a new message
// @route   POST /api/v1/message/send
// @access  Public
export const sendMessage = catchAsyncError(async (req, res, next) => {
  const { senderName, subject, message } = req.body;

  if (!senderName || !subject || !message) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const newMessage = await Message.create({ senderName, subject, message });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: newMessage,
  });
});

// @desc    Get all messages
// @route   GET /api/v1/message/getall
// @access  Admin
export const getAllMessages = catchAsyncError(async (req, res, next) => {
  const messages = await Message.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

// @desc    Get single message by ID
// @route   GET /api/v1/message/:id
// @access  Admin
export const getMessageById = catchAsyncError(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }

  res.status(200).json({
    success: true,
    data: message,
  });
});

// @desc    Delete message by ID
// @route   DELETE /api/v1/message/delete/:id
// @access  Admin
export const deleteMessage = catchAsyncError(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});
