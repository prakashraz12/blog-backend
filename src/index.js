import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import serverAccount from "./blog.json" assert { type: "json" };
import cookieParser from "cookie-parser";
import { connect_dataBase } from "./db/db.js";
dotenv.config();

const port = process.env.PORT || 4000;
//impprt routes
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import commentRouter from "./routes/comment.routes.js";

//app init,
const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(
  cors({
    credentials: true,
    origin: "https://blog-backend-a4fo.onrender.com",
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//
admin.initializeApp({
  credential: admin.credential.cert(serverAccount),
});

//
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/blog", commentRouter);

app.listen(port, () => {
  console.info("App is running on", port);
});

connect_dataBase();

//
