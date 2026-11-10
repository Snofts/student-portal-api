/**
 * @swagger
 * /register-lecturer:
 *  get:
 *    summary: Lecturer route to register a new lecturer
 *    responses:
 *      200:
 *      description: Successful response array
 * 
 */

import express from "express";

const router = express.Router();


// Register a lecturer
router.get("/register-lecturer", (req, res) => {
  res.status(200).send("Welcome to the student portal");
});


export const lecturerRoute = router;
