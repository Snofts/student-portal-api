import express from "express";

const router = express.Router();


// Register a admin
router.get("/register-admin", (req, res) => {
  res.status(200).send("Welcome to the student portal");
});


export const adminRoute = router;