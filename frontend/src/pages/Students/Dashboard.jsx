import React, { useState, useEffect } from "react";
import { StudentStats, AssignmentList } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  dummyStudent, 
  getInstructorById, 
  getAssignmentsByInstructor, 
  getStatsByInstructor,
  filterAssignments 
} from "../../data/dummyData";


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("problems");
  const [filter, setFilter] = useState("all");
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({});
  const [currentInstructor, setCurrentInstructor] = useState(null);
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Use effect to update assignments and stats when instructor changes
  useEffect(() => {
    const currentUser = user || dummyStudent;
    const instructorId = currentUser?.currentInstructor;
    
    if (instructorId) {
      const instructor = getInstructorById(instructorId);
      const instructorAssignments = getAssignmentsByInstructor(instructorId);
      const instructorStats = getStatsByInstructor(instructorId);
      
      setCurrentInstructor(instructor);
      setAssignments(instructorAssignments);
      setStats(instructorStats);
    }
  }, [user]);

  // Filter assignments based on active tab and filter
  const filteredAssignments = filterAssignments(assignments, activeTab, filter);
  
  // Format assignments for display
  const formattedAssignments = filteredAssignments.map(assignment => ({
    ...assignment,
    id: assignment._id,
    deadline: new Date(assignment.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    group: currentInstructor?.name || 'Unknown',
    instructor: currentInstructor?.name || 'Unknown'
  }));

  const onAssignmentSelect = (assignment) => {
    console.log('Selected assignment:', assignment);
    
    // Check if assignment is not overdue or expired
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    if (assignment.status === 'expired' || (dueDate < now && assignment.status === 'active')) {
      alert('This assignment is overdue and cannot be started.');
      return;
    }
    
    if (assignment.status === 'draft') {
      alert('This assignment is not yet available.');
      return;
    }
    
    // Navigate to Problem View Page
    navigate('/problem/' + assignment._id, { 
      replace: true, 
      state: { assignment } 
    });
  };
  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <StudentStats 
        name={(user || dummyStudent)?.name || "Student"} 
        instructor={currentInstructor?.name || "No Instructor Selected"} 
        stats={stats} 
      />

      <AssignmentList
        assignments={formattedAssignments}
        activeTab={activeTab}
        filter={filter}
        setActiveTab={setActiveTab}
        setFilter={setFilter}
        onAssignmentSelect={onAssignmentSelect}
      />
    </div>
  );
}
