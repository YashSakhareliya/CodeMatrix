// Central export file for all models
import Assignment from './assignment.model.js';
import Problem from './problem.model.js';
import Submission from './submission.model.js';
import Leaderboard from './leaderboard.model.js';
import Group from './group.model.js';
import Student from './student.model.js';
import Instructor from './instructor.model.js';
import BlacklistToken from './blacklistToken.model.js';
import Dashboard from './dashboard.model.js';

export {
    Assignment,
    Problem,
    Submission,
    Leaderboard,
    Group,
    Student,
    Instructor,
    BlacklistToken,
    Dashboard
};

// Default export for convenience
export default {
    Assignment,
    Problem,
    Submission,
    Leaderboard,
    Group,
    Student,
    Instructor,
    BlacklistToken,
    Dashboard
};
