import React, { useEffect, useState } from 'react'
import { ProblemOverview } from '../../components'
import { ChevronLeft, Timer, Home, X } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';

const ProblemView = () => {
    const [started, setStarted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { id } = useParams(); // get problem ID from URL
    const location = useLocation();
    const [assignment, setAssignment] = useState(location.state?.assignment || null);
    const [loading, setLoading] = useState(!assignment);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!assignment) {
            const fetchAssignment = async () => {
                try {
                    setLoading(true);
                    const res = await fetch(`/api/student/assignemnt/${id}`); // Adjust the URL to match your backend
                    const data = await res.json();
                    setAssignment(data);
                    setTimeLeft(data.timeLimit * 60);
                } catch (error) {
                    console.error('Error fetching assignment:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchAssignment();
        }else{
            setTimeLeft(assignment.timeLimit * 60);
        }
    }, [id, assignment]);

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

    // Need to Style this properly for better appearance
    if (loading) return <div>Loading...</div>;
    if (!assignment) return <div>No assignment found.</div>;
    // When User First Click on this that time first show Problem Overview Page
    if (!started) {
        return (
            <div className="h-screen">
                <ProblemOverview problem={assignment} onStart={() => setStarted(true)} />
            </div>
        );
    }


    // On back Function Need to Impelent
    const onBack = () => {
        // Implement your own back navigation logic here
        // user go to Dashboard Page
        // time Left is Saved 
        // when Return Come Time Is Resume
    }
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
                        {assignment.title}
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
        </div>
    )
}

export default ProblemView
