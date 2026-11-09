import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./model/studentModel.js";
import bcrypt from "bcrypt";
import User from "./model/userModel.js";
import { connectToDb } from "./config/db.js";
import {studentRoute} from "./routes/studentRoute.js";
import {lecturerRoute} from "./routes/lecturerRoute.js";
import { loginRoute } from "./routes/loginRoute.js";

dotenv.config();

const app = express();

const port = process.env.PORT;


app.use(express.json());

app.get("/", (req, res) => {
  console.log(req);
  res.status(200).send("Welcome to the student portal");
});

app.use("/api", studentRoute)

app.use("/api", lecturerRoute)

app.use("/api", loginRoute)

// Connect to mongodb and start the server

const startServer = async () => {
  try {
    
    await connectToDb();

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (e) {
    console.log(e.message, "Could not start server");
  }
};

startServer();
