import mongoose from "mongoose";
const { Schema, ObjectId } = mongoose;

// Assignment Schema
const assignmentSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10
    },
    instructorId: {
        type: ObjectId,
        ref: 'Instructor',
        required: true,
    },
    groupId: {
        type: ObjectId,
        ref: 'Group',
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
        enum: ["easy", "medium", "hard"]
    },
    totalTime: {
        type: Number, // in minutes
        required: true,
        min: 1
    },
    startTime: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.startTime;
            },
            message: 'Due date must be after start time'
        }
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'expired'],
        default: 'draft'
    },
    maxAttempts: {
        type: Number,
        default: null // null means unlimited attempts
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// Update the updatedAt field before saving
assignmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for getting problems in this assignment
assignmentSchema.virtual('problems', {
    ref: 'Problem',
    localField: '_id',
    foreignField: 'assignmentId'
});

// Virtual for getting submissions for this assignment
assignmentSchema.virtual('submissions', {
    ref: 'Submission',
    localField: '_id',
    foreignField: 'assignmentId'
});

export default mongoose.model('Assignment', assignmentSchema);