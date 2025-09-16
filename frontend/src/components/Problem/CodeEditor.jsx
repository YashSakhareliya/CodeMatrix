import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

export function CodeEditor({
  language,
  code,
  onCodeChange,
  onLanguageChange,
  onRun,
  onSubmit,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-matrix-border-primary px-4 py-2 flex items-center justify-between bg-matrix-bg-secondary">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-matrix-bg-tertiary text-matrix-text-primary px-3 py-1 rounded text-sm border border-matrix-border-primary focus:border-matrix-border-highlight outline-none"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            onClick={onRun}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-matrix-bg-tertiary text-matrix-text-primary rounded hover:bg-matrix-brand-hover transition-colors text-sm"
          >
            <Play className="h-4 w-4" />
            Run
          </button>
          <button
            onClick={onSubmit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-matrix-brand-primary text-matrix-text-secondary rounded hover:bg-matrix-brand-hover transition-colors text-sm"
          >
            <Send className="h-4 w-4" />
            Submit
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 },
          }}
        />
      </div>
    </div>
  );
}