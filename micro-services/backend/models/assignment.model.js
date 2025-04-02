import mongoose from "mongoose";
const { Schema, ObjectId } = mongoose;

// Assignment Schema
const assignmentSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        default: '',
    },
    instructorId: {
        type: ObjectId,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
        enum: ["easy", "medium", "hard"]
    },
    testCases: [{
        input: {
            type: String,
            required: true
        },
        expectedOutput: {
            type: String,
            required: true
        }
    }],
    students: [{
        type: ObjectId,
        ref: 'student', 
    }],
    totalTime: {
        type: Number,
        required: false,
        default: null,
    },
    dueDate: {
        type: Date,
        required: false,
        default: null,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending', 
    },
    submissions: [{
        type: ObjectId,
        ref: 'Submission', 
    }],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export default mongoose.model('Assignment', assignmentSchema);