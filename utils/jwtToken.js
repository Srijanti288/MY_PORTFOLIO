// ------------------ GENERATE TOKEN & SEND RESPONSE ------------------
export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // only https in production
    sameSite: "strict", // prevents CSRF
  };

  // Send response
  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user,
    });
};
