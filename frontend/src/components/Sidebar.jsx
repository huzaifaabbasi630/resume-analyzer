import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Upload, FileText, BarChart2, Briefcase, Award, User, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { logout, user } = useAuth();

    const navItems = [
        { to: '/dashboard', label: 'Dashboard', icon: Home },
        { to: '/upload', label: 'Upload Resume', icon: Upload },
        { to: '/builder', label: 'Resume Builder', icon: FileText },
        { to: '/analysis/latest', label: 'Analytics', icon: BarChart2 },
        { to: '/jobs', label: 'Job Matches', icon: Briefcase },
        { to: '/interview', label: 'Interview Prep', icon: Award },
        { to: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="w-64 bg-slate-900 h-screen text-slate-300 flex flex-col fixed inset-y-0 shadow-lg z-10 transition-transform duration-300 ease-in-out md:translate-x-0">
            <div className="px-6 py-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white tracking-widest shrink-0">ResumAI</h2>
            </div>

            <nav className="flex-1 px-4 mt-8 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-colors group ${isActive
                                ? 'bg-primary text-white'
                                : 'hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 bg-slate-800 shrink-0">
                <div className="flex items-center justify-between text-sm px-2">
                    <span>{user?.name || 'User'}</span>
                    <button
                        onClick={logout}
                        className="text-slate-400 hover:text-white p-2 rounded-md hover:bg-slate-700 transition"
                        title="Sign out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
