// Initialize Redux store with dummy data for development
import { loginSuccess } from '../store/authSlice';
import { dummyStudent } from '../data/dummyData';

export const initializeDummyAuth = (dispatch) => {
    // Check if user is already logged in
    const existingAuth = localStorage.getItem('authState');
    
    if (!existingAuth) {
        // Initialize with dummy student data
        const dummyAuthData = {
            user: dummyStudent,
            token: 'dummy-jwt-token-for-development',
            role: 'student'
        };
        
        dispatch(loginSuccess(dummyAuthData));
        console.log('Initialized with dummy student data for development');
    }
};
