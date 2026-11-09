import mongoose from "mongoose";

export const connectToDb = async (req, res) => {
 try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Mongodb connected successfully");
 } catch (error) {
    console.log(error.message, "Unable to connect to database");
 }
}