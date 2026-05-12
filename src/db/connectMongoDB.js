import mongoose from 'mongoose'

export async function conectMongoDB() {
  try {
    const MongoUrl = process.env.MONGO_URI;
    await mongoose.connect(MongoUrl)
    console.log(' ✅ MongoDB connection established successfully');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
