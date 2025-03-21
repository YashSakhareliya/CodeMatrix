import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    instructorId: {
        type: ObjectId, // Reference to Instructors collection
        required: true
    },
    students: [{
        type: ObjectId, // Reference to Users collection in backend service
        required: true
    }],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export default mongoose.model('Group', groupSchema);