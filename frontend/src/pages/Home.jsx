import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-white min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                Land your dream job with <span className="text-primary">AI</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl">
                Upload your resume and get instant ATS scoring, personalized improvement suggestions, and skill gap analysis tailored to your target roles.
            </p>

            <div className="flex gap-4">
                <Link
                    to="/signup"
                    className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                    Get Started
                </Link>
                <Link
                    to="/login"
                    className="bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition"
                >
                    Log in
                </Link>
            </div>
        </div>
    );
};

export default Home;
