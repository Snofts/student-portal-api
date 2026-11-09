import express from "express";
import { userLogin } from "../controllers/userLogin.js";


const router = express.Router();

// Login a user
router.post("/login", userLogin);

export const loginRoute = router;