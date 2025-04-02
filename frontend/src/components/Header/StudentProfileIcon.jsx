import React from 'react'
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';

const StudentProfileIcon = ({profileOpen, setProfileOpen, onLogout }) => {
    return (
        <div className="relative">
            <button
                className="flex items-center gap-2 hover:bg-matrix-bg-tertiary p-2 rounded-lg transition-colors"
                onClick={() => setProfileOpen(!profileOpen)}
            >
                <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    className="h-8 w-8 rounded-full border border-matrix-border-primary"
                    alt="Profile"
                />
                <ChevronDown className="h-4 w-4" />
            </button>

            {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-matrix-bg-secondary rounded-lg shadow-lg py-2 border border-matrix-border-primary">
                    <a
                        href="#"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-matrix-bg-tertiary hover:text-matrix-text-secondary transition-colors"
                    >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-matrix-bg-tertiary hover:text-matrix-text-secondary transition-colors"
                    >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                    </a>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-matrix-bg-tertiary hover:text-matrix-text-secondary transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default StudentProfileIcon
