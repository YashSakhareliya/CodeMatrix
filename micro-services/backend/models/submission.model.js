import mongoose from "mongoose";
const { Schema, ObjectId } = mongoose;

const submissionSchema = new Schema({
    studentId: {
        type: ObjectId,
        ref: 'Student',
        required: true
    },
    problemId: {
        type: ObjectId,
        ref: 'Problem',
        required: true
    },
    assignmentId: {
        type: ObjectId,
        ref: 'Assignment',
        required: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    language: {
        type: String,
        required: true,
        enum: ["python", "javascript", "java", "cpp", "c"]
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "running", "accepted", "wrong_answer", "time_limit_exceeded", "memory_limit_exceeded", "runtime_error", "compilation_error"],
        default: "pending"
    },
    executionTime: {
        type: Number, // in milliseconds
        required: false,
        default: null
    },
    memoryUsed: {
        type: Number, // in MB
        required: false,
        default: null
    },
    testCaseResults: [{
        testCaseIndex: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["passed", "failed", "error", "timeout"],
            required: true
        },
        executionTime: {
            type: Number, // in milliseconds
            default: null
        },
        memoryUsed: {
            type: Number, // in MB
            default: null
        },
        output: {
            type: String,
            default: ""
        },
        error: {
            type: String,
            default: ""
        },
        points: {
            type: Number,
            default: 0
        }
    }],
    testCasesPassed: {
        type: Number,
        required: true,
        default: 0
    },
    totalTestCases: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    maxScore: {
        type: Number,
        required: true,
        default: 100
    },
    submissionNumber: {
        type: Number,
        required: true,
        default: 1
    },
    isLatest: {
        type: Boolean,
        default: true
    },
    submittedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    judgedAt: {
        type: Date,
        default: null
    }
});

// Index for better query performance
submissionSchema.index({ studentId: 1, problemId: 1, submittedAt: -1 });
submissionSchema.index({ assignmentId: 1, studentId: 1 });
submissionSchema.index({ problemId: 1, status: 1 });
submissionSchema.index({ studentId: 1, isLatest: 1 });

// Pre-save middleware to handle submission numbering
submissionSchema.pre('save', async function(next) {
    if (this.isNew) {
        // Count existing submissions for this student and problem
        const count = await this.constructor.countDocuments({
            studentId: this.studentId,
            problemId: this.problemId
        });
        this.submissionNumber = count + 1;
        
        // Mark previous submissions as not latest
        await this.constructor.updateMany(
            {
                studentId: this.studentId,
                problemId: this.problemId,
                _id: { $ne: this._id }
            },
            { isLatest: false }
        );
    }
    next();
});

export default mongoose.model('Submission', submissionSchema);