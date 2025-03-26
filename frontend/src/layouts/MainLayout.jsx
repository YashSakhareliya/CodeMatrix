import React from 'react'
import { Outlet } from 'react-router-dom'
import { StudentNavbar, StudentSidebar } from '../components'
import { useState } from 'react'

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        <div className="h-screen flex flex-col bg-matrix-bg-primary text-matrix-text-primary">
            <StudentNavbar setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-1">
                {sidebarOpen && <StudentSidebar />}
                <main className="flex-1 overflow-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout
