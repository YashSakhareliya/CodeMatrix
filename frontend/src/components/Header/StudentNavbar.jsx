import React, { useState } from 'react';
import { Bell, ChevronDown, User, Settings, LogOut, Code2, Menu } from 'lucide-react';
import StudentProfileIcon from './StudentProfileIcon';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateCurrentInstructor } from '../../store/authSlice';
import { dummyInstructors, dummyStudent, getInstructorById } from '../../data/dummyData';



const StudentNavbar = ({ 
  profileOpen, 
  setProfileOpen, 
  sidebarOpen, 
  setSidebarOpen,
 }) => {

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth); // Get user and token from Redux
  
  // Use dummy data if no user in store
  const currentUser = user || dummyStudent;
  const currentInstructorId = currentUser?.currentInstructor;
  const currentInstructor = getInstructorById(currentInstructorId);
  
  // Get available instructors for this student
  const availableInstructors = dummyInstructors.filter(instructor => 
    currentUser?.activeInstructors?.includes(instructor._id)
  );

  const onLogout = () => {
    // Your logout logic here
    dispatch(logout())
  }

  const handleInstructorChange = (e) => {
    const newInstructorId = e.target.value;
    if (newInstructorId && newInstructorId !== currentInstructorId) {
      // Update the current instructor in Redux store
      dispatch(updateCurrentInstructor(newInstructorId));
      
      // In a real app, you would make an API call here:
      // try {
      //   const response = await updateCurrentInstructorAPI(newInstructorId);
      //   dispatch(loginSuccess(response.data));
      // } catch (error) {
      //   console.error('Failed to update instructor:', error);
      // }
    }
  };

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
        <select 
          className="bg-matrix-bg-tertiary text-matrix-text-secondary px-4 py-2 rounded-lg border border-matrix-border-primary focus:border-matrix-border-highlight outline-none"
          value={currentInstructorId || ''}
          onChange={handleInstructorChange}
        >
          <option value="" disabled>Select Instructor</option>
          {availableInstructors.map((instructor) => (
            <option key={instructor._id} value={instructor._id}>
              {instructor.name}
            </option>
          ))}
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

