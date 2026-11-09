import express from "express";
import { getAllStudent } from "../controllers/getAllStudent.js";
import { signup } from "../controllers/signupController.js";
import { createStudent } from "../controllers/createStudent.js";
import getSingleStudent from "../controllers/getSingleStudent.js";
import { updateStudentProfile } from "../controllers/updateStudentProfile.js";
import { deleteStudentProfile } from "../controllers/deleteStudentProfile.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get the list of students
router.get("/students", protect, getAllStudent);

// Sign up  as a student
router.post("/register-student", signup);

// Create new student
router.post("/student", protect, createStudent);

// Find a praticular student by id
router.get("/students/:id", protect, getSingleStudent);

// Update a particular student profile
router.patch("/students/:id", protect, updateStudentProfile);

// delete particular student profile
router.delete("/students/:id", protect, deleteStudentProfile);


export const studentRoute = router;