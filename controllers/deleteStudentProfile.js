import Student from "../model/studentModel.js";

export const deleteStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      id: Number(req.params.id),
    });
    if (!student) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}