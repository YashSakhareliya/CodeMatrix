import mongoose from "mongoose";
const { Schema, ObjectId } = mongoose;

// Dashboard Schema
const dashboardSchema = new Schema({
    studentId: {
        type: ObjectId,
        required: true,
        ref: 'user', 
    },
    instructorId: {
        type: ObjectId,
        required: true,
        ref: 'instructor', 
    },
    groupId:[{
        type: ObjectId,
        required: false,
    }],
    state: {
        rank: {
            type: Number,
            required: true,
            default: 0,
        },
        problemsSolved: {
            type: Number,
            required: true,
            default: 0,
        },
        tasksCompleted: {
            type: Number,
            required: true,
            default: 0,
        },
        totalTasks: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    assignments: [{
        type: ObjectId,
        ref: 'Assignment', 
    }],
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

export default Dashboard;