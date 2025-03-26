import { createSlice } from "@reduxjs/toolkit";

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('authState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const initialState = loadState() || {
    isAuthenticated: false,
    user: null,
    token: null,
    role: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.role;
            localStorage.setItem('authState', JSON.stringify(state));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.role = null;
            localStorage.removeItem('authState');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;