import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import serverAccount from "./blog.json" assert { type: "json" };
import cookieParser from "cookie-parser";
import http from "http";
import { connect_dataBase } from "./db/db.js";

dotenv.config();

const port = process.env.PORT || 4000;

// Import routes
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import commentRouter from "./routes/comment.routes.js";

// Initialize Express app
const app = express();
const server = http.createServer(app);



// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
export const userSocketMap = new Map();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serverAccount),
});

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/blog", commentRouter);




server.listen(port, () => {
  console.info("App is running on", port);
});

// Connect to the database
connect_dataBase();
