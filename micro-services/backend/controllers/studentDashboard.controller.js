import Dashboard from '../models/dashboard.model.js'

const getDashboard = async (req, res) => {
    try {
        const { instructorId } = req.params;
        const studentId = req.user._id;
        
        // get Dashboard Data
        const dashboardData = await Dashboard.findOne({ instructorId, studentId });

        // Check if dashboard data exists
        if (!dashboardData) {
            return res.status(404).json({
                success: false,
                message: 'Dashboard data not found for the given instructor and student'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Student dashboard data retrieved successfully',
            dashboardData
        });

    } catch (error) {
        console.error('Error fetching student dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student dashboard data',
            error: error.message
        });
    }
}

export { getDashboard };