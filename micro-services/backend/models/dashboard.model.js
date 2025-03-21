import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema({
    studentId: {
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
    rank: {
        type: Number,
        required: true,
        default: 0 
    },
    problemsSolved: {
        type: Number,
        required: true,
        default: 0
    },
    tasksCompleted: {
        type: Number,
        required: true,
        default: 0
    },
    totalTasks: {
        type: Number,
        required: true,
        default: 0
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export default mongoose.model('Dashboard', dashboardSchema);