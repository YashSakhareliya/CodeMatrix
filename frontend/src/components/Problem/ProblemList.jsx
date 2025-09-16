import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

export function ProblemList({
  problems,
  currentProblemId,
  completedProblems,
  onSelectProblem,
}) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-matrix-text-secondary mb-4">
          Problems
        </h2>
        <div className="space-y-2">
          {problems.map((problem) => (
            <button
              key={problem._id}
              onClick={() => onSelectProblem(problem)}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                problem._id === currentProblemId
                  ? 'bg-matrix-brand-primary text-matrix-text-secondary'
                  : 'bg-matrix-bg-tertiary hover:bg-matrix-brand-hover'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{problem.order}.</span>
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </span>
                </div>
                {completedProblems.has(problem._id) ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-matrix-text-primary" />
                )}
              </div>
              <p className="text-sm font-medium mb-1">{problem.title}</p>
              <p className="text-xs text-matrix-text-primary">{problem.points} points</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}