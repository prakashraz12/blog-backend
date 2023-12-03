import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import serverAccount from "./blog.json" assert { type: 'json' };

import { connect_dataBase } from "./db/db.js";
dotenv.config();
const port = process.env.PORT || 4000;
//impprt routes
import userRouter from "./routes/user.routes.js";

const app = express();
app.use(express.json());
app.use(cors());
//
admin.initializeApp({
  credential: admin.credential.cert(serverAccount),
});
//
app.use("/api/v1/user", userRouter);

app.listen(port, () => {
  console.info("App is running on", port);
});

connect_dataBase();

//
