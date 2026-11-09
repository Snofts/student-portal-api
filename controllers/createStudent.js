import Student from "../model/studentModel.js";

export const createStudent = async (req, res) => {
  try {
    const { id, name, email, department, level, age } = req.body;

    const student = await Student.create({
      id,
      name,
      email,
      department,
      level,
      age,
    });



    res.status(201).json({ message: "Created", student });
  } catch (error) {
    console.log(error.message, "Unable to create student profile");
  }
}