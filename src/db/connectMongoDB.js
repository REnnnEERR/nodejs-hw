import mongoose from 'mongoose'

export async function conectMongoDB() {
  try {
    const MongoUrl = process.env.MONGO_URI;
    await mongoose.connect(MongoUrl)
    console.log(' MONGODB Connected success');
  } catch (error) {
    console.error(error.messege);
    process.exit(1);
  }
}
