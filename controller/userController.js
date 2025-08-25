import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

// ------------------ REGISTER USER ------------------
export const register = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar and Resume are required!", 400));
  }

  const { avatar, resume } = req.files;
  if (!avatar || !resume) {
    return next(new ErrorHandler("Both avatar and resume must be provided!", 400));
  }

  // Upload avatar
  let cloudinaryResponseForAvatar;
  try {
    cloudinaryResponseForAvatar = await cloudinary.uploader.upload(avatar.tempFilePath, {
      folder: "AVATARS",
    });
  } catch {
    return next(new ErrorHandler("Avatar upload failed. Please try again.", 500));
  }

  // Upload resume
  let cloudinaryResponseForResume;
  try {
    cloudinaryResponseForResume = await cloudinary.uploader.upload(resume.tempFilePath, {
      folder: "MY_RESUME",
    });
  } catch {
    return next(new ErrorHandler("Resume upload failed. Please try again.", 500));
  }

  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    facebookURL,
    twitterURL,
    linkedInURL,
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email is already registered!", 400));
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    facebookURL,
    twitterURL,
    linkedInURL,
    avatar: {
      public_id: cloudinaryResponseForAvatar.public_id,
      url: cloudinaryResponseForAvatar.secure_url,
    },
    resume: {
      public_id: cloudinaryResponseForResume.public_id,
      url: cloudinaryResponseForResume.secure_url,
    },
  });

  generateToken(user, "User registered successfully", 201, res);
});

// ------------------ LOGIN ------------------
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and Password are required!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password.", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password.", 401));
  }

  generateToken(user, "Logged in Successfully", 200, res);
});

// ------------------ LOGOUT ------------------
export const logout = catchAsyncError(async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({ success: true, message: "Logged Out" });
});

// ------------------ GET USER ------------------
export const getUser = catchAsyncError(async (req, res, next) => {
  if (!req.user) return next(new ErrorHandler("Not authenticated", 401));

  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// ------------------ UPDATE PROFILE ------------------
export const updateProfile = catchAsyncError(async (req, res, next) => {
  if (!req.user) return next(new ErrorHandler("Not authenticated", 401));

  const newUserData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    portfolioURL: req.body.portfolioURL,
    githubURL: req.body.githubURL,
    instagramURL: req.body.instagramURL,
    facebookURL: req.body.facebookURL,
    twitterURL: req.body.twitterURL,
    linkedInURL: req.body.linkedInURL,
  };

  const user = await User.findById(req.user.id);

  if (req.files?.avatar) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
    const cloudinaryResponse = await cloudinary.uploader.upload(req.files.avatar.tempFilePath, {
      folder: "AVATARS",
    });
    newUserData.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  if (req.files?.resume) {
    await cloudinary.uploader.destroy(user.resume.public_id);
    const cloudinaryResponse = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
      folder: "MY_RESUME",
    });
    newUserData.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user: updatedUser,
  });
});

// ------------------ UPDATE PASSWORD ------------------
export const updatePassword = catchAsyncError(async (req, res, next) => {
  if (!req.user) return next(new ErrorHandler("Not authenticated", 401));

  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Current Password", 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("New password and confirm password do not match.", 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: "Password Updated Successfully!" });
});

// ------------------ FORGOT PASSWORD ------------------
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordURL = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  const message = `Your reset password link is:\n\n ${resetPasswordURL}\n\nIf you did not request this, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });
    res.status(200).json({ success: true, message: `Email sent to ${user.email}` });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// ------------------ RESET PASSWORD ------------------
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or expired", 400));
  }

  const { password, confirmNewPassword } = req.body;
  if (password !== confirmNewPassword) {
    return next(new ErrorHandler("Password & Confirm password do not match!", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  generateToken(user, "Password Reset Successfully!", 200, res);
});

// ------------------ PUBLIC USER PROFILE (for portfolio site) ------------------
export const getUserForPortfolio = catchAsyncError(async (req, res) => {
  const id = "68a9871324f277b93cca5853"; // <-- hardcoded (maybe temporary)
  const user = await User.findById(id);
  res.status(200).json({ success: true, user });
});
