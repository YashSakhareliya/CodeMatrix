import React, { useEffect, useState } from 'react'
import { ProblemOverview } from '../../components'
import { ChevronLeft, Timer, Home, X } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ProblemList } from '../../components/Problem/ProblemList';
import { ProblemDescription } from '../../components/Problem/ProblemDescription';
import { TestResults } from '../../components/Problem/TestResult';
import { CodeEditor } from '../../components/Problem/CodeEditor';
import { getAssignmentsByInstructor, getProblemsByAssignment } from '../../data/dummyData';
import { useSelector } from 'react-redux';

const ProblemView = () => {
    const [started, setStarted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { id } = useParams(); // get assignment ID from URL
    const location = useLocation();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(location.state?.assignment || null);
    const [loading, setLoading] = useState(!assignment);
    const [timeLeft, setTimeLeft] = useState(0);
    
    const { user } = useSelector((state) => state.auth);
    
    // New state variables for the components
    const [showResults, setShowResults] = useState(false);
    const [showTestCase, setShowTestCase] = useState(false);
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState('');
    const [completedProblems, setCompletedProblems] = useState(new Set());
    const [testResults, setTestResults] = useState([]);
    const [currentProblem, setCurrentProblem] = useState(null);


    useEffect(() => {
        // console.log(assignment)
        if (assignment) {
            console.log("Assignment found")
            // Find assignment from dummy data using the ID
            const currentUser = user || { currentInstructor: "674a1b2c3d4e5f6789012340" };
            const instructorAssignments = getAssignmentsByInstructor(currentUser.currentInstructor);
            const foundAssignment = instructorAssignments.find(a => a._id === id);
            
            if (foundAssignment) {
                // Get problems for this assignment
                const assignmentProblems = getProblemsByAssignment(foundAssignment._id);
                const assignmentWithProblems = {
                    ...foundAssignment,
                    problems: assignmentProblems
                };
                // console.log(assignment)
                setAssignment(assignmentWithProblems);
                setTimeLeft(foundAssignment.totalTime * 60);
            } else {
                // No assignment found, redirect back to dashboard
                navigate('/dashboard', { replace: true });
                return;
            }
            setLoading(false);
        } else {
            setTimeLeft(assignment.totalTime * 60);
        }
    }, [id, user]);

    // Separate effect to handle currentProblem and code initialization
    useEffect(() => {
        if (assignment && assignment.problems && assignment.problems.length > 0 && !currentProblem) {
            const firstProblem = assignment.problems[0];
            setCurrentProblem(firstProblem);
            setCode(firstProblem.defaultCode?.[language] || '');
        } else if (currentProblem && currentProblem.defaultCode) {
            setCode(currentProblem.defaultCode[language] || '');
        }
    }, [assignment, currentProblem, language, started]);

    useEffect(() => {
        if (started && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
        // time will Over Then Submit AutoMatically Problem 
    }, [started, timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Handler functions for the components
    const handleRun = () => {
        // Simulate running code with dummy test results
        const dummyTestResults = [
            {
                id: 1,
                status: 'success',
                runtime: '45ms',
                memory: '14.2MB',
                input: '[2,7,11,15]\n9',
                output: '[0,1]',
                expectedOutput: '[0,1]'
            },
            {
                id: 2,
                status: 'success',
                runtime: '38ms',
                memory: '14.1MB',
                input: '[3,2,4]\n6',
                output: '[1,2]',
                expectedOutput: '[1,2]'
            }
        ];
        setTestResults(dummyTestResults);
        setShowTestCase(true);
    };

    const handleSubmit = () => {
        // Simulate submission results
        setShowResults(true);
        setCompletedProblems(prev => new Set([...prev, currentProblem?._id]));
    };

    // Need to Style this properly for better appearance
    if (loading) return <div>Loading...</div>;
    if (!assignment) return <div>No assignment found.</div>;
    // When User First Click on this that time first show Problem Overview Page
    if (!started) {
        return (
            <div className="h-screen">
                <ProblemOverview assignment={assignment} onStart={() => setStarted(true)} />
            </div>
        );
    }


    // On back Function Need to Implement
    const onBack = () => {
        // Navigate back to Dashboard
        navigate('/dashboard', { replace: true });
        // In a real app, you would save the current state and time left
        // localStorage.setItem('assignmentState', JSON.stringify({
        //     assignmentId: assignment._id,
        //     timeLeft,
        //     currentProblem: currentProblem?._id,
        //     code
        // }));
    }
    // console.log(currentProblem)
    return (
        <div className='h-screen bg-matrix-bg-primary text-matrix-text-primary flex flex-col'>
            {/* Problem Header */}
            <div className='border-b border-matrix-border-primary p-4 flex items-center justify-between bg-matrix-bg-secondary'>
                {/* Left Side Header */}
                <div className='flex items-center gap-4'>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-matrix-bg-tertiary rounded-lg transition-colors"
                    >
                        <ChevronLeft className={`h-5 w-5 transform transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
                    </button>
                    <h1 className="text-xl font-semibold text-matrix-text-secondary">
                        {currentProblem?.title || assignment.title}
                    </h1>
                </div>
                {/* Right Side Header */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-matrix-bg-tertiary rounded-lg">
                        <Timer className="h-5 w-5 text-matrix-brand-primary" />
                        <span className="font-mono">{formatTime(timeLeft)}</span>
                    </div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 bg-matrix-bg-tertiary rounded-lg hover:bg-matrix-brand-hover transition-colors"
                    >
                        <Home className="h-5 w-5" />
                        Exit
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <PanelGroup direction="horizontal">
                    {sidebarOpen && (
                        <>
                            <Panel defaultSize={20} minSize={15}>
                                <div className="h-full border-r border-matrix-border-primary bg-matrix-bg-secondary">
                                    <ProblemList
                                        problems={assignment.problems || []}
                                        currentProblemId={currentProblem?._id}
                                        completedProblems={completedProblems}
                                        onSelectProblem={(problem) => {
                                            setCurrentProblem(problem);
                                            setCode(problem.defaultCode?.[language] || '');
                                        }}
                                    />
                                </div>
                            </Panel>
                            <PanelResizeHandle className="w-1 bg-matrix-border-primary hover:bg-matrix-brand-primary transition-colors" />
                        </>
                    )}

                    <Panel minSize={30}>
                        <div className="h-full border-r border-matrix-border-primary overflow-y-auto">
                            <ProblemDescription problem={currentProblem || assignment} />
                        </div>
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-matrix-border-primary hover:bg-matrix-brand-primary transition-colors" />

                    <Panel minSize={30}>
                        <div className="h-full flex flex-col">
                            {showResults ? (
                                <TestResults
                                    result={{
                                        status: 'Accepted',
                                        runtime: '52ms',
                                        memory: '41.5MB',
                                        rank: 12,
                                        testResults: [
                                            {
                                                status: 'Accepted',
                                                runtime: '52ms',
                                                memory: '41.5MB',
                                                testCase: 1,
                                                input: '[2,7,11,15]\n9',
                                                expectedOutput: '[0,1]',
                                                actualOutput: '[0,1]'
                                            },
                                            {
                                                status: 'Accepted',
                                                runtime: '48ms',
                                                memory: '41.3MB',
                                                testCase: 2,
                                                input: '[3,2,4]\n6',
                                                expectedOutput: '[1,2]',
                                                actualOutput: '[1,2]'
                                            }
                                        ]
                                    }}
                                    onBackToEditor={() => setShowResults(false)}
                                    onNextProblem={() => { }}
                                    onFinish={onBack}
                                />
                            ) : (
                                <PanelGroup direction="vertical">
                                    <Panel minSize={40}>
                                        <CodeEditor
                                            language={language}
                                            code={code}
                                            onCodeChange={setCode}
                                            onLanguageChange={(lang) => {
                                                setLanguage(lang);
                                                setCode(currentProblem?.defaultCode?.[lang] || '');
                                            }}
                                            onRun={handleRun}
                                            onSubmit={handleSubmit}
                                        />
                                    </Panel>

                                    {showTestCase && (
                                        <>
                                            <PanelResizeHandle className="h-1 bg-matrix-border-primary hover:bg-matrix-brand-primary transition-colors" />
                                            <Panel defaultSize={30} minSize={20}>
                                                <div className="h-full bg-matrix-bg-secondary overflow-y-auto">
                                                    <div className="p-4 border-b border-matrix-border-primary flex items-center justify-between">
                                                        <h3 className="text-lg font-semibold text-matrix-text-secondary">
                                                            Test Case Results
                                                        </h3>
                                                        <button
                                                            onClick={() => setShowTestCase(false)}
                                                            className="p-1 hover:bg-matrix-bg-tertiary rounded-lg transition-colors"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    <div className="p-4 space-y-4">
                                                        {testResults.map((test) => (
                                                            <div
                                                                key={test.id}
                                                                className="bg-matrix-bg-tertiary rounded-lg p-4"
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`text-lg ${test.status === 'success'
                                                                                ? 'text-green-500'
                                                                                : 'text-red-500'
                                                                            }`}>
                                                                            {test.status === 'success' ? '✓' : '✗'}
                                                                        </span>
                                                                        <span>Test Case {test.id}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-4 text-sm text-matrix-text-primary">
                                                                        <span>Runtime: {test.runtime}</span>
                                                                        <span>Memory: {test.memory}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2 text-sm">
                                                                    <div>
                                                                        <p className="text-matrix-text-primary">Input:</p>
                                                                        <pre className="mt-1 bg-matrix-bg-primary p-2 rounded">
                                                                            {test.input}
                                                                        </pre>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-matrix-text-primary">Your Output:</p>
                                                                        <pre className="mt-1 bg-matrix-bg-primary p-2 rounded">
                                                                            {test.output}
                                                                        </pre>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-matrix-text-primary">Expected Output:</p>
                                                                        <pre className="mt-1 bg-matrix-bg-primary p-2 rounded">
                                                                            {test.expectedOutput}
                                                                        </pre>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Panel>
                                        </>
                                    )}
                                </PanelGroup>
                            )}
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    )
}

export default ProblemView
