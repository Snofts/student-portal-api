import Student from "../model/studentModel.js";

const getSingleStudent = async (req, res) => {
  console.log(req.params);

  try {
    // const student = students.find((item) => item.id === Number(req.params.id));
    const student = await Student.findOne({ id: Number(req.params.id) });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export default getSingleStudent;