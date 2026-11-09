import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from 'bcrypt'; 

export const signup = async (req, res) => {
   console.log("Url", req.url);
  try {
    const { fullName, password, email, userName } = req.body;

    console.log("Signup request body", req.body);

    const costFactor = 12;

    const hashedPassword = await bcrypt.hash(password, costFactor);

    console.log("Hashed password", hashedPassword);

    const user = await User.create({
      fullName,
      userName,
      password: hashedPassword,
      email,
      role: "student",
    });

      // Generate JWT
    const token = generateToken(user._id);


    res.status(201).json({ message: "Account created", user, token });
  } catch (error) {
    // console.log(error.message, "Unable to create a student account");
    res.status(400).json({ message: "Unable to create a student account", error: error.message });
  }
}