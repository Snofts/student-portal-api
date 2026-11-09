import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import generateToken from './../utils/generateToken.js';

export const userLogin =  async (req, res) => {
    try {
        const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if the user exists in the database
    const user = await User.findOne({ email });


    console.log("User found:", user);

    if (!user) {
        return res.status(401).json({ message: "Account does not exist. Create an account" });
    }

    // Check if the password is correct
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
        return res.status(401).json({ message: "Incorrect password" }); 
    }

    const token = generateToken(user._id);

    res.status(200).json({ message: "Login successful", user, token });
        
    } catch (error) {
        console.log(error.message, "Unable to login");
        res.status(500).json({ message: "Internal server error" });
    }
    
}