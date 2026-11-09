import Student from "../model/studentModel.js";

export const getAllStudent = async (req, res) => {
  try {
    const allStudents = await Student.find();
    res.status(200).json(allStudents);
  } catch (error) {
    console.log(error.message, "Could not retrieve student list");
  }
}