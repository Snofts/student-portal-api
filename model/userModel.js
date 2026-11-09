import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    unique: true
  },
  userName:{
    type: String,
    required: false,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ["admin", "student", "leturer"],
    default: "student"
  }
});

const User = mongoose.model("User", userSchema);

export default User;