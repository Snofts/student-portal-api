/**
 * @swagger
 * /login:
 *  post:
 *      summary: Login route for user authentication
 *      responses:
 *          200:
 *          description: Successful response array
 * 
 */

import express from "express";
import { userLogin } from "../controllers/userLogin.js";


const router = express.Router();

// Login a user
router.post("/login", userLogin);

export const loginRoute = router;