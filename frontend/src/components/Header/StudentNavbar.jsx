import React from 'react';
import { Bell, ChevronDown, User, Settings, LogOut, Code2, Menu } from 'lucide-react';
import StudentProfileIcon from './StudentProfileIcon';

const onLogout = () => {
  // Your logout logic here
  console.log('LogOut button clicked');
}
const StudentNavbar = ({ profileOpen, setProfileOpen, sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="border-b border-matrix-border-primary p-4 flex items-center justify-between bg-matrix-bg-secondary">
      <div className="flex items-center gap-2">
        
        <Code2 className="h-8 w-8 text-matrix-brand-primary" />
        <span className="text-xl font-bold text-matrix-text-secondary">
          CodeMatrix
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-matrix-bg-tertiary rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5 text-matrix-text-primary" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <select className="bg-matrix-bg-tertiary text-matrix-text-secondary px-4 py-2 rounded-lg border border-matrix-border-primary focus:border-matrix-border-highlight outline-none">
          <option selected>Select Instructor</option>
          <option>Instructor 1</option>
          <option>Instructor 2</option>
        </select>

        <button className="p-2 hover:bg-matrix-bg-tertiary rounded-full transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        <StudentProfileIcon
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        onLogout={onLogout} 
        />
      </div>
    </div>
  )
}

export default StudentNavbar

