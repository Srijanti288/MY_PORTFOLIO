// Custom ErrorHandler class (extends built-in Error)
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);               // set error.message
    this.statusCode = statusCode; // custom property for HTTP status
  }
}

// Error handling middleware
export const errorMiddleware = (err, req, res, next) => {
  // Fallback values (if err doesn’t have them) or Start with safe defaults
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongo duplicate key error
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    message = `Duplicate ${fields.join(", ")} entered`;
    statusCode = 400;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "JSON Web Token is invalid. Try again!";
    statusCode = 401; // Unauthorized
  }

  if (err.name === "TokenExpiredError") {
    message = "JSON Web Token has expired. Try again!";
    statusCode = 401;
  }

  // Handle Mongoose CastError (invalid ObjectId etc.)
  if (err.name === "CastError") {
    message = `Invalid ${err.path}`;
    statusCode = 400;
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError" && err.errors) {
    message = Object.values(err.errors).map(e => e.message).join(" ");
    statusCode = 400;
  }

  // Send JSON response
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default ErrorHandler;
