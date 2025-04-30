import React, { useEffect, useState } from 'react'
import { ProblemOverview } from '../../components'
import { useLocation, useParams } from 'react-router-dom';

const ProblemView = () => {
    const [started, setStarted] = useState(false);
    const { id } = useParams(); // get problem ID from URL
    const location = useLocation();
    const [assignment, setAssignment] = useState(location.state?.assignment || null);
    const [loading, setLoading] = useState(!assignment);

    useEffect(() => {
        if(!assignment) {
            const fetchAssignment = async () => {
                try {
                  setLoading(true);
                  const res = await fetch(`/api/student/assignemnt/${id}`); // Adjust the URL to match your backend
                  const data = await res.json();
                  setAssignment(data);
                } catch (error) {
                  console.error('Error fetching assignment:', error);
                } finally {
                  setLoading(false);
                }
              };
        
              fetchAssignment();
        }
    }, [id, assignment]);


    // Need to Style this properly for better appearance
    if (loading) return <div>Loading...</div>;
    if (!assignment) return <div>No assignment found.</div>;


    if (!started) {
        return (
          <div className="h-screen">
            <ProblemOverview problem={assignment} onStart={() => setStarted(true)} />
          </div>
        );
    }
  return (
    <div>
      In Problem View Page
    </div>
  )
}

export default ProblemView
