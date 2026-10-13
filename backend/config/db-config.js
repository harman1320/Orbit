import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo DB connected");
  } catch (err) {
    console.error(
      `Error while establishing connection with Mongo DB: ${err.message}`,
    );
    throw err;
  }
};

export default connectDB;
