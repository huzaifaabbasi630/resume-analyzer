import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

// Private Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UploadResume from './pages/UploadResume';
import ResumeBuilder from './pages/ResumeBuilder';
import AnalysisResult from './pages/AnalysisResult';
import JobMatch from './pages/JobMatch';
import InterviewPractice from './pages/InterviewPractice';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
};

const App = () => {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>

            <Route path="/" element={<Home />} />

            <Route element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/upload" element={<UploadResume />} />
                <Route path="/builder" element={<ResumeBuilder />} />
                <Route path="/analysis/:id" element={<AnalysisResult />} />
                <Route path="/jobs" element={<JobMatch />} />
                <Route path="/interview" element={<InterviewPractice />} />
            </Route>
        </Routes>
    );
};

export default App;
