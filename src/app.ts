import express, { Application, Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to DevPulse API - Internal Tech Issue & Feature Tracker",
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
