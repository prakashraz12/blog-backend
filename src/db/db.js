import mongoose from "mongoose";

export const connect_dataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info("Connected to the database");
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    throw error;
  }
};
