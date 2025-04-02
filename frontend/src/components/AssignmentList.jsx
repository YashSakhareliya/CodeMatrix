import React from 'react'
import { Clock, AlertCircle } from 'lucide-react';

const AssignmentList = ({
    assignments,
    activeTab,
    filter,
    setActiveTab,
    setFilter,
    onAssignmentSelect
}) => {
    return (
        <div className="bg-matrix-bg-secondary p-6 rounded-lg border border-matrix-border-primary">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4">
                    <button
                        className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'problems'
                                ? 'bg-matrix-brand-primary text-matrix-text-secondary'
                                : 'bg-matrix-bg-tertiary text-matrix-text-primary hover:text-matrix-text-secondary'
                            }`}
                        onClick={() => setActiveTab('problems')}
                    >
                        Problems
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'tasks'
                                ? 'bg-matrix-brand-primary text-matrix-text-secondary'
                                : 'bg-matrix-bg-tertiary text-matrix-text-primary hover:text-matrix-text-secondary'
                            }`}
                        onClick={() => setActiveTab('tasks')}
                    >
                        Tasks
                    </button>
                </div>
                <div className="flex gap-2">
                    {['all', 'due soon', 'overdue'].map((f) => (
                        <button
                            key={f}
                            className={`px-3 py-1 rounded-lg capitalize transition-colors ${filter === f
                                    ? 'bg-matrix-brand-primary text-matrix-text-secondary'
                                    : 'bg-matrix-bg-tertiary text-matrix-text-primary hover:text-matrix-text-secondary'
                                }`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-matrix-bg-tertiary p-4 rounded-lg flex items-center justify-between border border-matrix-border-primary hover:border-matrix-border-highlight transition-colors">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-matrix-text-primary">{assignment.group}</span>
                                {assignment.type === 'problem' && assignment.difficulty && (
                                    <span className="px-2 py-1 text-xs rounded bg-matrix-brand-primary text-matrix-text-secondary">
                                        {assignment.difficulty}
                                    </span>
                                )}
                            </div>
                            <h3 className="font-semibold text-matrix-text-secondary">{assignment.title}</h3>
                            <div className="flex items-center gap-2 mt-2 text-sm text-matrix-text-primary">
                                <Clock className="h-4 w-4" />
                                <span>Due: {assignment.deadline}</span>
                                {assignment.status === 'overdue' && (
                                    <span className="flex items-center gap-1 text-matrix-status-error">
                                        <AlertCircle className="h-4 w-4" />
                                        Overdue
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => onAssignmentSelect(assignment)}
                            className="px-4 py-2 bg-matrix-brand-primary text-matrix-text-secondary rounded-lg hover:bg-matrix-brand-hover transition-colors"
                        >
                            {assignment.type === 'problem' ? 'Solve' : 'Start Task'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AssignmentList
