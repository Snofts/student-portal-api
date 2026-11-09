import Student from "../model/studentModel.js";
import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import generateToken from './../utils/generateToken.js';
import User from "../model/userModel.js";
// import generateToken from "../utils/generateToken.js";
// import bcrypt from 'bcrypt'; 

const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!student) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ data: student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const userLogin =  async (req, res) => {
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




const signup = async (req, res) => {
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

export { updateStudentProfile, userLogin, signup };