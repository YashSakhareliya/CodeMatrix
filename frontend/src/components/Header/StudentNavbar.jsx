import React, { useState } from 'react';
import { Bell, ChevronDown, User, Settings, LogOut, Code2, Menu } from 'lucide-react';
import StudentProfileIcon from './StudentProfileIcon';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';



// instructor change

const StudentNavbar = ({ 
  profileOpen, 
  setProfileOpen, 
  sidebarOpen, 
  setSidebarOpen,
 }) => {

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth); // Get user and token from Redux
  const currentInstructor = user?.currentInstructor || '';

  const onLogout = () => {
    // Your logout logic here
    dispatch(logout())
  }

  const handleInstructorChange = (e) => {
    e.preventDefault();
    const newInstructor = e.target.value;
    // change in backend currentInstructor
    try{

      // make backend request to change curInstructor

      // responce give return user

      // update store with return user

      // change currentInstructor
    }
    catch(error){
      console.error(error);
    }
  }

  // make find list of activateInstructor List that appears in select option and user can switch on that
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
          {/* value={currentInstructor}
              onChange={handleInstructorChange}
          */}
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

