import React from 'react'

const StudentStats = ({name, instructor, stats}) => {
    return (
        <div className="bg-matrix-bg-secondary p-6 rounded-lg border border-matrix-border-primary">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-matrix-text-secondary mb-2">{name}</h2>
                <p className="text-matrix-text-primary">Instructor: {instructor}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-matrix-bg-tertiary p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-matrix-text-secondary mb-2">Problems</h3>
                    <p className="text-3xl text-matrix-brand-primary">{stats.problemsSolved}</p>
                    <p className="text-sm text-matrix-text-primary">of {stats.totalProblems} solved</p>
                    <div className="mt-2 w-full bg-matrix-bg-primary rounded-full h-2">
                        <div
                            className="bg-matrix-brand-primary rounded-full h-2"
                            style={{ width: `${(stats.problemsSolved / stats.totalProblems) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-matrix-bg-tertiary p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-matrix-text-secondary mb-2">Tasks</h3>
                    <p className="text-3xl text-matrix-brand-primary">{stats.tasksCompleted}</p>
                    <p className="text-sm text-matrix-text-primary">of {stats.totalTasks} completed</p>
                    <div className="mt-2 w-full bg-matrix-bg-primary rounded-full h-2">
                        <div
                            className="bg-matrix-brand-primary rounded-full h-2"
                            style={{ width: `${(stats.tasksCompleted / stats.totalTasks) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-matrix-bg-tertiary p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-matrix-text-secondary mb-2">Rank</h3>
                    <p className="text-3xl text-matrix-brand-primary">{stats.rank}</p>
                    <p className="text-sm text-matrix-text-primary">Global ranking</p>
                </div>
            </div>
        </div>
    )
}

export default StudentStats
