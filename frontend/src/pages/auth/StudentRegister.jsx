import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Code2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const StudentRegister = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError('All fields are required');
            return;
        }

        const userData = {
            name: name,
            email: email,
            password: password
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, userData);
            if (response.status === 201) {
                const user = {
                    user: response.data.user,
                    token: response.data.token,
                    role: 'student'
                }
                dispatch(loginSuccess(user));
                setName("");
                setEmail("");
                setPassword("");
                setError("");
                navigate('/student/login');
            } else {
                setError(response.data.message);
                setName("");
                setEmail("");
                setPassword("");
                navigate('/student/register');
            }
        } catch (error) {
            setName("");
            setEmail("");
            setPassword("");
            setError("Internal server error");
            navigate('/student/register');
        }
    }

    const handleGoogleRegister = (e) => {
        e.preventDefault();
        // Google Sign-in logic here
    }
    return (
        <div className="min-h-screen bg-matrix-bg-primary flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Code2 className="h-10 w-10 text-matrix-brand-primary" />
                        <h1 className="text-3xl font-bold text-matrix-text-secondary">CodeMatrix</h1>
                    </div>
                    <h2 className="text-2xl font-semibold text-matrix-text-secondary mb-2">Create Student Account</h2>
                    <p className="text-matrix-text-primary">Join our community of learners</p>
                </div>

                <div className="bg-matrix-bg-secondary rounded-xl p-8 shadow-lg border border-matrix-border-primary">
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-matrix-text-primary mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-matrix-text-primary" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-matrix-bg-tertiary text-matrix-text-secondary rounded-lg border border-matrix-border-primary focus:border-matrix-border-highlight outline-none"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-matrix-text-primary mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-matrix-text-primary" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-matrix-bg-tertiary text-matrix-text-secondary rounded-lg border border-matrix-border-primary focus:border-matrix-border-highlight outline-none"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-matrix-text-primary mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-matrix-text-primary" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-matrix-bg-tertiary text-matrix-text-secondary rounded-lg border border-matrix-border-primary focus:border-matrix-border-highlight outline-none"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-matrix-brand-primary text-matrix-text-secondary py-2 rounded-lg hover:bg-matrix-brand-hover transition-colors flex items-center justify-center gap-2"
                        >
                            Create Account
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-matrix-border-primary"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-matrix-bg-secondary text-matrix-text-primary">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleRegister}
                            className="mt-4 w-full bg-matrix-bg-tertiary text-matrix-text-secondary py-2 rounded-lg hover:bg-matrix-brand-hover transition-colors flex items-center justify-center gap-2"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                            Sign in with Google
                        </button>
                    </div>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-matrix-text-primary">Already have an account? </span>
                        <Link to="/student/login" className="text-matrix-brand-primary hover:text-matrix-brand-hover">
                            Sign in here
                        </Link>
                    </div>

                    <div className="mt-4 text-center text-sm">
                        <Link to="/instructor/register" className="text-matrix-text-primary hover:text-matrix-brand-primary">
                            Register as Instructor
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentRegister
