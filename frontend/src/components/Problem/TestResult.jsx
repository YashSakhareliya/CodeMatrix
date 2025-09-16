import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, ArrowLeft, ArrowRight, Home } from 'lucide-react';

export function TestResults({ result, onBackToEditor, onNextProblem, onFinish }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'Wrong Answer':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'Time Limit Exceeded':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-red-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          {getStatusIcon(result.status)}
          <h2 className="text-2xl font-bold text-matrix-text-secondary">
            {result.status}
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-matrix-bg-tertiary p-4 rounded-lg">
            <p className="text-sm text-matrix-text-primary mb-1">Runtime</p>
            <p className="text-lg font-semibold text-matrix-text-secondary">
              {result.runtime}
            </p>
          </div>
          <div className="bg-matrix-bg-tertiary p-4 rounded-lg">
            <p className="text-sm text-matrix-text-primary mb-1">Memory</p>
            <p className="text-lg font-semibold text-matrix-text-secondary">
              {result.memory}
            </p>
          </div>
          <div className="bg-matrix-bg-tertiary p-4 rounded-lg">
            <p className="text-sm text-matrix-text-primary mb-1">Rank</p>
            <p className="text-lg font-semibold text-matrix-text-secondary">
              #{result.rank}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-lg font-semibold text-matrix-text-secondary mb-4">
          Test Cases
        </h3>
        <div className="space-y-4">
          {result.testResults.map((test, index) => (
            <div
              key={index}
              className="bg-matrix-bg-tertiary p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-matrix-text-secondary">
                  Test Case {test.testCase}
                </span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                  <span className="text-sm">{test.runtime}</span>
                </div>
              </div>
              {test.status !== 'Accepted' && (
                <div className="mt-4 space-y-2 text-sm">
                  <div>
                    <p className="text-matrix-text-primary">Input:</p>
                    <pre className="mt-1 bg-matrix-bg-primary p-2 rounded">
                      {test.input}
                    </pre>
                  </div>
                  <div>
                    <p className="text-matrix-text-primary">Expected Output:</p>
                    <pre className="mt-1 bg-matrix-bg-primary p-2 rounded">
                      {test.expectedOutput}
                    </pre>
                  </div>
                  <div>
                    <p className="text-matrix-text-primary">Your Output:</p>
                    <pre className="mt-1 bg-matrix-bg-primary p-2 rounded">
                      {test.actualOutput}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-matrix-border-primary mt-6 pt-4 flex gap-4">
        <button
          onClick={onBackToEditor}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-matrix-bg-tertiary text-matrix-text-primary rounded-lg hover:bg-matrix-brand-hover transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Editor
        </button>
        <button
          onClick={onNextProblem}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-matrix-brand-primary text-matrix-text-secondary rounded-lg hover:bg-matrix-brand-hover transition-colors"
        >
          Next Problem
          <ArrowRight className="h-5 w-5" />
        </button>
        <button
          onClick={onFinish}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-matrix-bg-tertiary text-matrix-text-primary rounded-lg hover:bg-matrix-brand-hover transition-colors"
        >
          <Home className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}