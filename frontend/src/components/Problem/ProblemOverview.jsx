import React from 'react'
import { Trophy, Clock, FileText, Play } from 'lucide-react';

const ProblemOverview = ({ problem, onStart }) => {
    return (
        <div className="min-h-screen bg-matrix-bg-primary text-matrix-text-primary p-8 flex flex-col items-center justify-center">
            <div className="max-w-3xl w-full bg-matrix-bg-secondary rounded-xl p-8 shadow-lg border border-matrix-border-primary">
                <h1 className="text-3xl font-bold text-matrix-text-secondary mb-2">
                    {problem.title}
                </h1>
                <div className="flex items-center gap-2 text-matrix-text-primary mb-6">
                    <span className="px-3 py-1 rounded-full bg-matrix-bg-tertiary">
                        {problem.group}
                    </span>
                    <span className={`px-3 py-1 rounded-full ${problem.difficulty === 'Easy' ? 'bg-green-600' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-600' :
                                'bg-red-600'
                        }`}>
                        {problem.difficulty}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-matrix-bg-tertiary p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="h-6 w-6 text-matrix-brand-primary" />
                            <h2 className="text-xl font-semibold text-matrix-text-secondary">Time Limit</h2>
                        </div>
                        <p className="text-2xl">{problem.timeLimit} minutes</p>
                    </div>
                    <div className="bg-matrix-bg-tertiary p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-6 w-6 text-matrix-brand-primary" />
                            <h2 className="text-xl font-semibold text-matrix-text-secondary">Questions</h2>
                        </div>
                        <p className="text-2xl">1 Problem</p>
                    </div>
                </div>

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

                <button
                    onClick={onStart}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-matrix-brand-primary text-matrix-text-secondary rounded-lg hover:bg-matrix-brand-hover transition-colors text-lg font-semibold"
                >
                    <Play className="h-5 w-5" />
                    Start Problem
                </button>
            </div>
        </div>
    )
}

export default ProblemOverview
