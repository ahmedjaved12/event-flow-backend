import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import authRouter from "./routes/auth";
import eventsRouter from "./routes/events";
import participantsRouter from "./routes/participants";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import uploadsRouter from "./routes/uploads";
import registrationsRouter from "./routes/registrations";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Handle file serving
if (process.env.NODE_ENV === "production") {
  // In production (Vercel): serve files from /tmp/uploads
  app.use("/uploads", (req, res) => {
    const filePath = path.join("/tmp/uploads", req.path);

    if (fs.existsSync(filePath)) {
      const ext = path.extname(req.path).toLowerCase();
      const contentType =
        {
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
          ".gif": "image/gif",
          ".webp": "image/webp",
          ".pdf": "application/pdf",
        }[ext] || "application/octet-stream";

      res.setHeader("Content-Type", contentType);
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });
} else {
  // In local dev: serve from ./uploads folder
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
}

// ✅ API routes
app.get("/", (_req, res) => res.send("Backend is working! 🚀"));
app.use("/auth", authRouter);
app.use("/events", eventsRouter);
app.use("/participants", participantsRouter);
app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use("/uploads", uploadsRouter); // POST /uploads
app.use("/registrations", registrationsRouter);

// ✅ Export Express app for Vercel serverless
export default app;
