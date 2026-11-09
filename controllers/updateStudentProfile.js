import Student from "../model/studentModel.js";

export const updateStudentProfile = async (req, res) => {
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