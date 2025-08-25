// ------------------ SERVER ENTRY POINT ------------------

// Import app (Express instance)
import app from "./app.js";
import cloudinary from "cloudinary";

// ------------------ CLOUDINARY CONFIG ------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------------ SERVER START ------------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `✅ Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  );
});

// ------------------ GLOBAL ERROR HANDLERS ------------------
// Handle synchronous errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message);
  process.exit(1);
});
