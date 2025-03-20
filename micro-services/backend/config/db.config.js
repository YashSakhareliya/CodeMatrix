import mongoose from 'mongoose';

const connectMongoDb = async () => {
    await mongoose.connect(process.env.USER_MONGO_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('Error connecting to MongoDB:', err.message));

}

export { connectMongoDb }