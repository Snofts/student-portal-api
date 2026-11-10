

import express from "express";
import { getAllStudent } from "../controllers/getAllStudent.js";
import { signup } from "../controllers/signupController.js";
import { createStudent } from "../controllers/createStudent.js";
import getSingleStudent from "../controllers/getSingleStudent.js";
import { updateStudentProfile } from "../controllers/updateStudentProfile.js";
import { deleteStudentProfile } from "../controllers/deleteStudentProfile.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


/**
 * @swagger
 * /students:
 *  get:
 *    summary: Get the list of students
 *    responses:
 *      200:
 *        description: Successful response array.
 *
 */
// Get the list of students
router.get("/students", protect, getAllStudent);


/**
 * @swagger
 * /register-student:
 *  post:
 *    summary: Student route to Sign up  as a student
 *    responses:
 *      200:
 *        description: Successful response array.
 *
 */
// Sign up  as a student
router.post("/register-student", signup);



/**
 * @swagger
 * /student:
 *  post:
 *    summary: Student route to Create new student
 *    responses:
 *      200:
 *        description: Successful response array.
 *
 */
// Create new student
router.post("/student", protect, createStudent);


/**
 * @swagger
 * /students/:id:
 *  get:
 *    summary: Find a praticular student by id
 *    responses:
 *      200:
 *        description: Successful response array.
 *
 */
// Find a praticular student by id
router.get("/students/:id", protect, getSingleStudent);


/**
 * @swagger
 * /students/:id":
 *  patch:
 *    summary: Update a particular student profile
 *    responses:
 *      200:
 *        description: Successful response array.
 *
 */
// Update a particular student profile
router.patch("/students/:id", protect, updateStudentProfile);


/**
 * @swagger
 * /students/:id:
 *  delete:
 *    summary: Delete a particular student profile
 *    responses:
 *      200:
 *        description: Successful response array.
 *
 */
// delete particular student profile
router.delete("/students/:id", protect, deleteStudentProfile);

export const studentRoute = router;
