import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Code, Wrench, Clock, Zap } from 'lucide-react';

const DevelopmentInProgress = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/dashboard');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const features = [
        {
            icon: <Code className="w-6 h-6" />,
            title: "Advanced Code Editor",
            description: "Enhanced syntax highlighting and auto-completion",
            status: "In Progress"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Real-time Collaboration",
            description: "Work together with your team members",
            status: "Coming Soon"
        },
        {
            icon: <Wrench className="w-6 h-6" />,
            title: "Advanced Analytics",
            description: "Detailed performance insights and reports",
            status: "Planning"
        }
    ];

    return (
        <div className="min-h-screen bg-matrix-bg-primary text-matrix-text-primary flex flex-col items-center justify-center p-8">
            <div className="max-w-4xl w-full text-center">
                {/* Development Icon */}
                <div className="mb-8">
                    <div className="w-32 h-32 mx-auto bg-matrix-bg-secondary rounded-full flex items-center justify-center border-2 border-matrix-border-primary relative">
                        <Code className="w-16 h-16 text-matrix-brand-primary" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-matrix-status-warning rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-matrix-text-secondary" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-matrix-text-secondary mb-4">
                        Development in Progress
                    </h1>
                    <p className="text-xl text-matrix-text-primary leading-relaxed mb-6">
                        We're working hard to bring you amazing new features. 
                        This section is currently under development and will be available soon.
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8 bg-matrix-bg-secondary rounded-xl p-6 border border-matrix-border-primary">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-matrix-text-secondary">Development Progress</h3>
                        <span className="text-matrix-brand-primary font-semibold">75%</span>
                    </div>
                    <div className="w-full bg-matrix-bg-tertiary rounded-full h-3 mb-4">
                        <div className="bg-matrix-brand-primary h-3 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-sm text-matrix-text-primary">
                        Expected completion: Coming Soon
                    </p>
                </div>

                {/* Features Coming Soon */}
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-matrix-text-secondary mb-6">
                        What's Coming
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-matrix-bg-secondary rounded-lg p-6 border border-matrix-border-primary">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-matrix-bg-tertiary rounded-lg text-matrix-brand-primary">
                                        {feature.icon}
                                    </div>
                                    <h4 className="font-semibold text-matrix-text-secondary">{feature.title}</h4>
                                </div>
                                <p className="text-matrix-text-primary mb-4 text-sm">
                                    {feature.description}
                                </p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    feature.status === 'In Progress' 
                                        ? 'bg-matrix-status-warning text-matrix-text-secondary'
                                        : feature.status === 'Coming Soon'
                                        ? 'bg-matrix-status-info text-matrix-text-secondary'
                                        : 'bg-matrix-bg-tertiary text-matrix-text-primary'
                                }`}>
                                    {feature.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stay Updated */}
                <div className="mb-8 bg-matrix-bg-secondary rounded-xl p-6 border border-matrix-border-primary">
                    <h3 className="text-xl font-semibold text-matrix-text-secondary mb-4">
                        Stay Updated
                    </h3>
                    <p className="text-matrix-text-primary mb-4">
                        Want to be notified when this feature is ready? We'll keep you posted on our progress.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <div className="flex items-center gap-2 text-sm text-matrix-text-primary">
                            <div className="w-2 h-2 bg-matrix-status-success rounded-full"></div>
                            Follow our development updates
                        </div>
                        <div className="flex items-center gap-2 text-sm text-matrix-text-primary">
                            <div className="w-2 h-2 bg-matrix-status-info rounded-full"></div>
                            Check back regularly for new features
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-matrix-bg-tertiary text-matrix-text-primary rounded-lg hover:bg-matrix-brand-hover transition-colors border border-matrix-border-primary"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Go Back
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-matrix-brand-primary text-matrix-text-secondary rounded-lg hover:bg-matrix-brand-hover transition-colors font-semibold"
                    >
                        <Home className="h-5 w-5" />
                        Go to Dashboard
                    </button>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-sm text-matrix-text-primary">
                    <p>Development Status: Active | Last Updated: {new Date().toLocaleDateString()}</p>
                    <p className="mt-1">Thank you for your patience as we build something amazing!</p>
                </div>
            </div>
        </div>
    );
};

export default DevelopmentInProgress;
