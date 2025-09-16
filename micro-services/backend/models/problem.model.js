import mongoose from "mongoose";
const { Schema, ObjectId } = mongoose;

const problemSchema = new Schema({
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
    assignmentId: {
        type: ObjectId,
        ref: 'Assignment',
        required: true
    },
    instructorId: {
        type: ObjectId,
        ref: 'Instructor',
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ["easy", "medium", "hard"]
    },
    points: {
        type: Number,
        required: true,
        min: 1,
        default: 100
    },
    timeLimit: {
        type: Number, // in seconds
        required: false,
        default: null
    },
    memoryLimit: {
        type: Number, // in MB
        required: false,
        default: 256
    },
    testCases: [{
        input: {
            type: String,
            required: true
        },
        expectedOutput: {
            type: String,
            required: true
        },
        isHidden: {
            type: Boolean,
            default: false // false for sample test cases, true for hidden test cases
        },
        points: {
            type: Number,
            default: 0 // points for this specific test case
        }
    }],
    constraints: {
        type: String,
        trim: true
    },
    inputFormat: {
        type: String,
        trim: true
    },
    outputFormat: {
        type: String,
        trim: true
    },
    sampleInput: {
        type: String,
        trim: true
    },
    sampleOutput: {
        type: String,
        trim: true
    },
    hints: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    order: {
        type: Number,
        required: true,
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    },
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
});

// Update the updatedAt field before saving
problemSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for getting submissions for this problem
problemSchema.virtual('submissions', {
    ref: 'Submission',
    localField: '_id',
    foreignField: 'problemId'
});

// Index for better query performance
problemSchema.index({ assignmentId: 1, order: 1 });
problemSchema.index({ instructorId: 1 });
problemSchema.index({ difficulty: 1 });

export default mongoose.model('Problem', problemSchema);