import mongoose from "mongoose";
const { Schema, ObjectId } = mongoose;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    instructorId: {
        type: ObjectId,
        ref: 'Instructor',
        required: true
    },
    students: [{
        type: ObjectId,
        ref: 'Student'
    }],
    maxStudents: {
        type: Number,
        default: null // null means no limit
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinCode: {
        type: String,
        unique: true,
        sparse: true // allows multiple null values
    },
    allowSelfJoin: {
        type: Boolean,
        default: false
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
groupSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for getting assignments for this group
groupSchema.virtual('assignments', {
    ref: 'Assignment',
    localField: '_id',
    foreignField: 'groupId'
});

// Virtual for student count
groupSchema.virtual('studentCount').get(function() {
    return this.students.length;
});

// Index for better query performance
groupSchema.index({ instructorId: 1 });
groupSchema.index({ joinCode: 1 });

export default mongoose.model('Group', groupSchema);