import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Header/Navbar'
import Sidebar from '../components/Header/Sidebar'
import { useState } from 'react'

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        <div className="h-screen flex flex-col bg-matrix-bg-primary text-matrix-text-primary">
            <Navbar setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-1">
                {sidebarOpen && <Sidebar />}
                <main className="flex-1 overflow-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout
