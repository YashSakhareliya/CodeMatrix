import mongoose from 'mongoose';

const connectMongoDb = async () => {
    await mongoose.connect(process.env.USER_MONGO_URI,{
        serverSelectionTimeoutMS: 5000, // Timeout after 5s
        connectTimeoutMS: 10000,        // Max connect time
        maxPoolSize: 10
    })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('Error connecting to MongoDB:', err.message));

}

export { connectMongoDb }