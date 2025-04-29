import mongoose from "mongoose";
const { ObjectId } = mongoose;

const submissionSchema = new mongoose.Schema({
    studentId: {
        type: ObjectId, 
        required: true
    },
    assignmentId: {
        type: ObjectId, 
        required: true
    },
    instructorId: {
        type: ObjectId, 
        required: true
    },
    groupId: {
        type: ObjectId, 
        required: false,
        default: null
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ["python", "javascript", "java", "cpp"]
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "accepted", "wrong", "error"],
        default: "pending"
    },
    executionTime: {
        type: Number, 
        required: false,
        default: null
    },
    testCasesPassed: {
        type: Number,
        required: false,
        default: 0
    },
    totalTestCases: {
        type: Number,
        required: true
    },
    submittedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export default mongoose.model('Submission', submissionSchema);