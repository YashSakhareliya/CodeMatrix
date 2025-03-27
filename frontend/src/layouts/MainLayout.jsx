import React from 'react'
import { Outlet } from 'react-router-dom'
import { StudentNavbar, StudentSidebar } from '../components'
import { useState } from 'react'

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    
    return (
        <div className="h-screen flex flex-col bg-matrix-bg-primary text-matrix-text-primary">
            
            <div className="fixed top-0 left-0 right-0 z-50">
                <StudentNavbar
                    profileOpen={profileOpen}
                    setProfileOpen={setProfileOpen}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
            </div>

            <div className="flex pt-[64px] h-screen"> 
                
                {sidebarOpen && (
                    <div className="fixed left-0 top-[80px] bottom-0 w-64 bg-matrix-bg-secondary border-r border-matrix-border-primary">
                        <StudentSidebar />
                    </div>
                )}

                <main className={`flex-1 overflow-auto p-4 ${sidebarOpen ? 'ml-64' : ''}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout
