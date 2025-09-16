import mongoose from "mongoose";
const { Schema, ObjectId } = mongoose;

const leaderboardSchema = new Schema({
    assignmentId: {
        type: ObjectId,
        ref: 'Assignment',
        required: true
    },
    groupId: {
        type: ObjectId,
        ref: 'Group',
        required: true
    },
    instructorId: {
        type: ObjectId,
        ref: 'Instructor',
        required: true
    },
    rankings: [{
        studentId: {
            type: ObjectId,
            ref: 'Student',
            required: true
        },
        rank: {
            type: Number,
            required: true,
            min: 1
        },
        totalScore: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        maxPossibleScore: {
            type: Number,
            required: true,
            default: 0
        },
        problemsAttempted: {
            type: Number,
            required: true,
            default: 0
        },
        problemsSolved: {
            type: Number,
            required: true,
            default: 0
        },
        totalSubmissions: {
            type: Number,
            required: true,
            default: 0
        },
        totalExecutionTime: {
            type: Number, // in milliseconds
            required: true,
            default: 0
        },
        averageExecutionTime: {
            type: Number, // in milliseconds
            default: 0
        },
        problemStats: [{
            problemId: {
                type: ObjectId,
                ref: 'Problem',
                required: true
            },
            bestScore: {
                type: Number,
                default: 0
            },
            maxScore: {
                type: Number,
                required: true
            },
            attempts: {
                type: Number,
                default: 0
            },
            bestExecutionTime: {
                type: Number, // in milliseconds
                default: null
            },
            status: {
                type: String,
                enum: ['not_attempted', 'attempted', 'solved'],
                default: 'not_attempted'
            },
            firstSolvedAt: {
                type: Date,
                default: null
            },
            lastAttemptAt: {
                type: Date,
                default: null
            }
        }],
        lastSubmissionAt: {
            type: Date,
            default: null
        },
        completionPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    }],
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Index for better query performance
leaderboardSchema.index({ assignmentId: 1 });
leaderboardSchema.index({ groupId: 1 });
leaderboardSchema.index({ instructorId: 1 });
leaderboardSchema.index({ 'rankings.studentId': 1 });
leaderboardSchema.index({ 'rankings.rank': 1 });

// Static method to update leaderboard after a submission
leaderboardSchema.statics.updateLeaderboard = async function(assignmentId, studentId, submissionData) {
    try {
        // Find or create leaderboard for this assignment
        let leaderboard = await this.findOne({ assignmentId });
        
        if (!leaderboard) {
            // Get assignment details to create new leaderboard
            const Assignment = mongoose.model('Assignment');
            const assignment = await Assignment.findById(assignmentId);
            
            if (!assignment) {
                throw new Error('Assignment not found');
            }
            
            leaderboard = new this({
                assignmentId,
                groupId: assignment.groupId,
                instructorId: assignment.instructorId,
                rankings: []
            });
        }
        
        // Find or create student ranking
        let studentRanking = leaderboard.rankings.find(
            ranking => ranking.studentId.toString() === studentId.toString()
        );
        
        if (!studentRanking) {
            studentRanking = {
                studentId,
                rank: leaderboard.rankings.length + 1,
                totalScore: 0,
                maxPossibleScore: 0,
                problemsAttempted: 0,
                problemsSolved: 0,
                totalSubmissions: 0,
                totalExecutionTime: 0,
                averageExecutionTime: 0,
                problemStats: [],
                completionPercentage: 0
            };
            leaderboard.rankings.push(studentRanking);
        }
        
        // Update problem stats
        let problemStat = studentRanking.problemStats.find(
            stat => stat.problemId.toString() === submissionData.problemId.toString()
        );
        
        if (!problemStat) {
            problemStat = {
                problemId: submissionData.problemId,
                bestScore: 0,
                maxScore: submissionData.maxScore,
                attempts: 0,
                status: 'not_attempted'
            };
            studentRanking.problemStats.push(problemStat);
            studentRanking.problemsAttempted++;
        }
        
        // Update stats based on submission
        problemStat.attempts++;
        problemStat.lastAttemptAt = submissionData.submittedAt;
        
        if (submissionData.score > problemStat.bestScore) {
            problemStat.bestScore = submissionData.score;
            
            if (submissionData.executionTime && 
                (!problemStat.bestExecutionTime || submissionData.executionTime < problemStat.bestExecutionTime)) {
                problemStat.bestExecutionTime = submissionData.executionTime;
            }
        }
        
        // Update problem status
        if (submissionData.status === 'accepted' && problemStat.status !== 'solved') {
            problemStat.status = 'solved';
            problemStat.firstSolvedAt = submissionData.submittedAt;
            studentRanking.problemsSolved++;
        } else if (problemStat.status === 'not_attempted') {
            problemStat.status = 'attempted';
        }
        
        // Recalculate student totals
        studentRanking.totalSubmissions++;
        studentRanking.totalScore = studentRanking.problemStats.reduce((sum, stat) => sum + stat.bestScore, 0);
        studentRanking.maxPossibleScore = studentRanking.problemStats.reduce((sum, stat) => sum + stat.maxScore, 0);
        
        if (submissionData.executionTime) {
            studentRanking.totalExecutionTime += submissionData.executionTime;
            studentRanking.averageExecutionTime = studentRanking.totalExecutionTime / studentRanking.totalSubmissions;
        }
        
        studentRanking.completionPercentage = studentRanking.maxPossibleScore > 0 
            ? (studentRanking.totalScore / studentRanking.maxPossibleScore) * 100 
            : 0;
        
        studentRanking.lastSubmissionAt = submissionData.submittedAt;
        
        // Recalculate ranks
        leaderboard.rankings.sort((a, b) => {
            // Primary: Total score (descending)
            if (b.totalScore !== a.totalScore) {
                return b.totalScore - a.totalScore;
            }
            // Secondary: Problems solved (descending)
            if (b.problemsSolved !== a.problemsSolved) {
                return b.problemsSolved - a.problemsSolved;
            }
            // Tertiary: Average execution time (ascending - faster is better)
            if (a.averageExecutionTime !== b.averageExecutionTime) {
                return a.averageExecutionTime - b.averageExecutionTime;
            }
            // Quaternary: Last submission time (ascending - earlier is better)
            return new Date(a.lastSubmissionAt) - new Date(b.lastSubmissionAt);
        });
        
        // Update ranks
        leaderboard.rankings.forEach((ranking, index) => {
            ranking.rank = index + 1;
        });
        
        leaderboard.lastUpdated = new Date();
        
        await leaderboard.save();
        return leaderboard;
        
    } catch (error) {
        console.error('Error updating leaderboard:', error);
        throw error;
    }
};

// Static method to get leaderboard for an assignment
leaderboardSchema.statics.getAssignmentLeaderboard = async function(assignmentId, limit = 50) {
    return await this.findOne({ assignmentId })
        .populate('rankings.studentId', 'name email uid')
        .populate('rankings.problemStats.problemId', 'title difficulty points')
        .populate('assignmentId', 'title')
        .lean();
};

// Static method to get student's position in leaderboard
leaderboardSchema.statics.getStudentRank = async function(assignmentId, studentId) {
    const leaderboard = await this.findOne({ assignmentId });
    if (!leaderboard) return null;
    
    const studentRanking = leaderboard.rankings.find(
        ranking => ranking.studentId.toString() === studentId.toString()
    );
    
    return studentRanking || null;
};

export default mongoose.model('Leaderboard', leaderboardSchema);
