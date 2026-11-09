import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  id:{
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },

  level: {
    type: Number,
    required: true
  },
  age:{
    type: Number,
    required: false
  }
});

const Student = mongoose.model("Student", studentSchema);

export default Student;