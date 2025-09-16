import React from 'react'
import { Trophy, Clock, FileText, Play, User, Calendar, Target } from 'lucide-react';
import { getProblemsByAssignment } from '../../data/dummyData';

const ProblemOverview = ({ assignment, onStart }) => {
    // Get problems for the assignment if not already included
    const assignmentProblems = getProblemsByAssignment(assignment?._id) || [];
    // console.log("Assignemnt Problems", assignmentProblems)
    // Dummy assignment data based on backend models
    // const dummyAssignment = assignment || {
    //     _id: "674a1b2c3d4e5f6789012345",
    //     title: "Data Structures & Algorithms Challenge",
    //     description: "This assignment covers fundamental data structures and algorithms concepts including arrays, linked lists, trees, and sorting algorithms. Students will solve multiple problems of varying difficulty levels.",
    //     instructorId: {
    //         _id: "674a1b2c3d4e5f6789012340",
    //         name: "Dr. Sarah Johnson",
    //         email: "sarah.johnson@university.edu"
    //     },
    //     groupId: {
    //         _id: "674a1b2c3d4e5f6789012341",
    //         name: "CS-301 Advanced Programming",
    //         semester: "Fall 2024"
    //     },
    //     difficulty: "medium",
    //     totalTime: 120, // 2 hours
    //     startTime: new Date("2024-01-15T09:00:00Z"),
    //     dueDate: new Date("2024-01-20T23:59:59Z"),
    //     status: "active",
    //     maxAttempts: 3,
    //     problems: [
    //         {
    //             _id: "674a1b2c3d4e5f6789012346",
    //             title: "Two Sum",
    //             difficulty: "easy",
    //             points: 100,
    //             order: 1,
    //             tags: ["array", "hash-table"]
    //         },
    //         {
    //             _id: "674a1b2c3d4e5f6789012347",
    //             title: "Binary Tree Traversal",
    //             difficulty: "medium",
    //             points: 150,
    //             order: 2,
    //             tags: ["tree", "recursion", "dfs"]
    //         },
    //         {
    //             _id: "674a1b2c3d4e5f6789012348",
    //             title: "Merge Sort Implementation",
    //             difficulty: "medium",
    //             points: 200,
    //             order: 3,
    //             tags: ["sorting", "divide-conquer", "recursion"]
    //         },
    //         {
    //             _id: "674a1b2c3d4e5f6789012349",
    //             title: "Graph Shortest Path",
    //             difficulty: "hard",
    //             points: 250,
    //             order: 4,
    //             tags: ["graph", "dijkstra", "dynamic-programming"]
    //         }
    //     ]
    // };

    const currentAssignment = assignment;
    const problems = assignmentProblems.length > 0 ? assignmentProblems : (currentAssignment.problems || []);
    // console.log(problems)
    const totalProblems = problems.length;
    const totalPoints = problems.reduce((sum, problem) => sum + (problem.points || 0), 0);
    
    // Count problems by difficulty
    const difficultyCount = problems.reduce((acc, problem) => {
        acc[problem.difficulty] = (acc[problem.difficulty] || 0) + 1;
        return acc;
    }, {});

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'bg-green-600';
            case 'medium': return 'bg-yellow-600';
            case 'hard': return 'bg-red-600';
            default: return 'bg-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-matrix-bg-primary text-matrix-text-primary p-8 flex flex-col items-center justify-center">
            <div className="max-w-5xl w-full bg-matrix-bg-secondary rounded-xl p-8 shadow-lg border border-matrix-border-primary">
                {/* Assignment Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-matrix-text-secondary mb-2">
                        {currentAssignment.title}
                    </h1>
                    <p className="text-matrix-text-primary mb-4 leading-relaxed">
                        {currentAssignment.description}
                    </p>
                    
                    {/* Assignment Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-matrix-text-primary">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{currentAssignment.instructorId?.name || "Dr. Sarah Johnson"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {formatDate(currentAssignment.dueDate)}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-white ${getDifficultyColor(currentAssignment.difficulty)}`}>
                            {currentAssignment.difficulty.charAt(0).toUpperCase() + currentAssignment.difficulty.slice(1)}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-matrix-bg-tertiary">
                            {currentAssignment.groupId?.name || "CS-301 Advanced Programming"}
                        </span>
                    </div>
                </div>

                {/* Assignment Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-matrix-bg-tertiary p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="h-6 w-6 text-matrix-brand-primary" />
                            <h2 className="text-lg font-semibold text-matrix-text-secondary">Time Limit</h2>
                        </div>
                        <p className="text-2xl">{currentAssignment.totalTime} minutes</p>
                    </div>
                    
                    <div className="bg-matrix-bg-tertiary p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-6 w-6 text-matrix-brand-primary" />
                            <h2 className="text-lg font-semibold text-matrix-text-secondary">Problems</h2>
                        </div>
                        <p className="text-2xl">{totalProblems}</p>
                    </div>
                    
                    <div className="bg-matrix-bg-tertiary p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="h-6 w-6 text-matrix-brand-primary" />
                            <h2 className="text-lg font-semibold text-matrix-text-secondary">Total Points</h2>
                        </div>
                        <p className="text-2xl">{totalPoints}</p>
                    </div>
                    
                    <div className="bg-matrix-bg-tertiary p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="h-6 w-6 text-matrix-brand-primary" />
                            <h2 className="text-lg font-semibold text-matrix-text-secondary">Max Attempts</h2>
                        </div>
                        <p className="text-2xl">{currentAssignment.maxAttempts || "Unlimited"}</p>
                    </div>
                </div>

                {/* Problems Overview */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-matrix-text-secondary mb-4">Problems in this Assignment</h3>
                    <div className="grid gap-4">
                        {problems.map((problem, index) => (
                            <div key={problem._id} className="bg-matrix-bg-tertiary p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-matrix-brand-primary rounded-full flex items-center justify-center text-matrix-text-secondary font-semibold">
                                        {problem.order || index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-matrix-text-secondary">{problem.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-1 text-xs rounded-full text-white ${getDifficultyColor(problem.difficulty)}`}>
                                                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                            </span>
                                            <span className="text-sm text-matrix-text-primary">{problem.points} points</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {problem.tags?.slice(0, 3).map((tag, tagIndex) => (
                                        <span key={tagIndex} className="px-2 py-1 text-xs bg-matrix-bg-primary rounded text-matrix-text-primary">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Difficulty Distribution */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-matrix-text-secondary mb-4">Difficulty Distribution</h3>
                    <div className="flex gap-4">
                        {Object.entries(difficultyCount).map(([difficulty, count]) => (
                            <div key={difficulty} className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full ${getDifficultyColor(difficulty)}`}></div>
                                <span className="text-sm text-matrix-text-primary">
                                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}: {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                    <button className="flex items-center gap-2 px-6 py-3 bg-matrix-bg-tertiary rounded-lg hover:bg-matrix-brand-hover transition-colors">
                        <FileText className="h-5 w-5" />
                        View Submissions
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-matrix-bg-tertiary rounded-lg hover:bg-matrix-brand-hover transition-colors">
                        <Trophy className="h-5 w-5" />
                        Leaderboard
                    </button>
                </div>

                {/* Start Assignment Button */}
                <button
                    onClick={onStart}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-matrix-brand-primary text-matrix-text-secondary rounded-lg hover:bg-matrix-brand-hover transition-colors text-lg font-semibold"
                >
                    <Play className="h-5 w-5" />
                    Start Assignment
                </button>
            </div>
        </div>
    )
}

export default ProblemOverview
