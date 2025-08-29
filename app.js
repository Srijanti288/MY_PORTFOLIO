// Core & third-party imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// Local imports
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRoutes.js";
import userRouter from "./router/userRoutes.js";
import educationRouter from "./router/educationRoutes.js";
import ApplicationRouter from "./router/softwareApplicationRoutes.js";
import skillRouter from "./router/skillRoutes.js";

// ------------------ ENVIRONMENT CONFIG ------------------
dotenv.config({ path: "./config/config.env" });

// ------------------ APP INITIALIZATION ------------------
const app = express();

// ------------------ MIDDLEWARES ------------------

// CORS setup
app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies
  })
);

// Parse cookies
app.use(cookieParser());

// Parse JSON & URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload handling
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ------------------ ROUTES ------------------
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/education", educationRouter);
app.use("/api/v1/softwareapplication", ApplicationRouter);
app.use("/api/v1/skill", skillRouter);

// ------------------ ERROR HANDLING ------------------
app.use(errorMiddleware);

// ------------------ DATABASE CONNECTION ------------------
dbConnection();


export default app;
