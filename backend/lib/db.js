import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo DB connected `);
  } catch (error) {
    console.log("Error connecting to mongo db", error.message);
  }
};