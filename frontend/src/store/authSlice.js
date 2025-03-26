import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem("role") || null,  // 'student' or 'instructor'
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.role;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("role", action.payload.role);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.role = null;
            localStorage.removeItem("token");
            localStorage.removeItem("role");
        },
    }
})

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer