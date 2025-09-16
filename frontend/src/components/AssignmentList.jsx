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
                {assignments.length === 0 ? (
                    <div className="text-center py-8 text-matrix-text-primary">
                        <p>No assignments found for the selected filters.</p>
                        <p className="text-sm mt-2">Try changing the filter or tab selection.</p>
                    </div>
                ) : (
                    assignments.map((assignment) => {
                        const isOverdue = assignment.status === 'expired' || 
                            (new Date(assignment.dueDate) < new Date() && assignment.status === 'active');
                        const isDueSoon = () => {
                            const now = new Date();
                            const dueDate = new Date(assignment.dueDate);
                            const timeDiff = dueDate.getTime() - now.getTime();
                            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                            return daysDiff <= 3 && daysDiff >= 0 && assignment.status === 'active';
                        };
                        
                        return (
                            <div key={assignment.id || assignment._id} className="bg-matrix-bg-tertiary p-4 rounded-lg flex items-center justify-between border border-matrix-border-primary hover:border-matrix-border-highlight transition-colors">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-matrix-text-primary">{assignment.group}</span>
                                        {assignment.type === 'problem' && assignment.difficulty && (
                                            <span className={`px-2 py-1 text-xs rounded text-white ${
                                                assignment.difficulty === 'easy' ? 'bg-green-600' :
                                                assignment.difficulty === 'medium' ? 'bg-yellow-600' :
                                                assignment.difficulty === 'hard' ? 'bg-red-600' :
                                                'bg-matrix-brand-primary'
                                            }`}>
                                                {assignment.difficulty.charAt(0).toUpperCase() + assignment.difficulty.slice(1)}
                                            </span>
                                        )}
                                        {assignment.status === 'draft' && (
                                            <span className="px-2 py-1 text-xs rounded bg-gray-600 text-white">
                                                Draft
                                            </span>
                                        )}
                                        {isDueSoon() && (
                                            <span className="px-2 py-1 text-xs rounded bg-orange-600 text-white">
                                                Due Soon
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-matrix-text-secondary">{assignment.title}</h3>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-matrix-text-primary">
                                        <Clock className="h-4 w-4" />
                                        <span>Due: {assignment.deadline}</span>
                                        {isOverdue && (
                                            <span className="flex items-center gap-1 text-matrix-status-error">
                                                <AlertCircle className="h-4 w-4" />
                                                Overdue
                                            </span>
                                        )}
                                    </div>
                                    {assignment.totalTime && (
                                        <div className="flex items-center gap-2 mt-1 text-sm text-matrix-text-primary">
                                            <span>Time Limit: {assignment.totalTime} minutes</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => onAssignmentSelect(assignment)}
                                    disabled={isOverdue || assignment.status === 'draft'}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        isOverdue || assignment.status === 'draft'
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'bg-matrix-brand-primary text-matrix-text-secondary hover:bg-matrix-brand-hover'
                                    }`}
                                >
                                    {assignment.type === 'problem' ? 'Solve' : 'Start Task'}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}

export default AssignmentList
