import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

const PageNotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/dashboard');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-matrix-bg-primary text-matrix-text-primary flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="w-32 h-32 mx-auto bg-matrix-bg-secondary rounded-full flex items-center justify-center border-2 border-matrix-border-primary">
                        <AlertTriangle className="w-16 h-16 text-matrix-status-error" />
                    </div>
                </div>

                {/* Error Code */}
                <div className="mb-6">
                    <h1 className="text-8xl font-bold text-matrix-brand-primary mb-4">404</h1>
                    <h2 className="text-3xl font-semibold text-matrix-text-secondary mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-matrix-text-primary leading-relaxed">
                        The page you're looking for doesn't exist or has been moved. 
                        It might have been deleted, renamed, or you entered the wrong URL.
                    </p>
                </div>

                {/* Suggestions */}
                <div className="mb-8 bg-matrix-bg-secondary rounded-xl p-6 border border-matrix-border-primary">
                    <h3 className="text-xl font-semibold text-matrix-text-secondary mb-4">
                        What can you do?
                    </h3>
                    <ul className="text-left space-y-2 text-matrix-text-primary">
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-matrix-brand-primary rounded-full"></div>
                            Check the URL for any typos
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-matrix-brand-primary rounded-full"></div>
                            Go back to the previous page
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-matrix-brand-primary rounded-full"></div>
                            Return to the dashboard
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-matrix-brand-primary rounded-full"></div>
                            Contact support if the problem persists
                        </li>
                    </ul>
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

                {/* Additional Info */}
                <div className="mt-8 text-sm text-matrix-text-primary">
                    <p>Error Code: 404 | Page Not Found</p>
                    <p className="mt-1">If you believe this is an error, please contact the administrator.</p>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
