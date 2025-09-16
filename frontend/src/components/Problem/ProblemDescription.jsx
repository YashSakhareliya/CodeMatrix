import React from 'react';
import { Clock, User, BookOpen } from 'lucide-react';

export function ProblemDescription({ problem }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  // Handle both individual problem and assignment fallback
  const displayProblem = problem || {};
  const hasExamples = displayProblem.examples && Array.isArray(displayProblem.examples);
  const hasConstraints = displayProblem.constraints && (Array.isArray(displayProblem.constraints) || typeof displayProblem.constraints === 'string');

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-matrix-text-secondary mb-2">
          {displayProblem.title || 'Problem Title'}
        </h1>
        <div className="flex flex-wrap gap-3 mb-4">
          {displayProblem.difficulty && (
            <span className={`px-3 py-1 rounded-full text-sm text-white ${getDifficultyColor(displayProblem.difficulty)}`}>
              {displayProblem.difficulty.charAt(0).toUpperCase() + displayProblem.difficulty.slice(1)}
            </span>
          )}
          {displayProblem.points && (
            <span className="px-3 py-1 rounded-full bg-matrix-bg-tertiary text-sm">
              {displayProblem.points} points
            </span>
          )}
          {displayProblem.tags && displayProblem.tags.length > 0 && (
            displayProblem.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-3 py-1 rounded-full bg-matrix-brand-primary text-matrix-text-secondary text-sm">
                {tag}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-matrix-text-secondary mb-4">Description</h2>
          <p className="text-matrix-text-primary whitespace-pre-line">
            {displayProblem.description || 'Problem description will appear here.'}
          </p>
        </div>

        {hasExamples && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-matrix-text-secondary mb-4">Examples</h2>
            {displayProblem.examples.map((example, index) => (
              <div key={index} className="mb-4 bg-matrix-bg-tertiary p-4 rounded-lg">
                <div className="mb-2">
                  <strong className="text-matrix-text-secondary">Input:</strong>
                  <pre className="mt-1 bg-matrix-bg-primary p-2 rounded">{example.input}</pre>
                </div>
                <div className="mb-2">
                  <strong className="text-matrix-text-secondary">Output:</strong>
                  <pre className="mt-1 bg-matrix-bg-primary p-2 rounded">{example.output}</pre>
                </div>
                {example.explanation && (
                  <div>
                    <strong className="text-matrix-text-secondary">Explanation:</strong>
                    <p className="mt-1">{example.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {hasConstraints && (
          <div>
            <h2 className="text-xl font-semibold text-matrix-text-secondary mb-4">Constraints</h2>
            {Array.isArray(displayProblem.constraints) ? (
              <ul className="list-disc list-inside space-y-2">
                {displayProblem.constraints.map((constraint, index) => (
                  <li key={index} className="text-matrix-text-primary">{constraint}</li>
                ))}
              </ul>
            ) : (
              <div className="text-matrix-text-primary whitespace-pre-line">
                {displayProblem.constraints.split('\n').map((line, index) => (
                  <p key={index} className="mb-1">• {line}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {!hasExamples && !hasConstraints && displayProblem.title && (
          <div className="text-center py-8 text-matrix-text-primary">
            <p>Select a problem from the sidebar to view its details.</p>
          </div>
        )}
      </div>
    </div>
  );
}