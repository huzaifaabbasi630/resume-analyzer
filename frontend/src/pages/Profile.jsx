import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, ShieldAlert, BadgeInfo } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you entirely sure? This action cannot be undone.")) {
            try {
                setLoading(true);
                await api.delete('/users/profile');
                logout();
            } catch (err) {
                console.error('Failed to delete account');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Profile</h2>
                <p className="mt-1 text-slate-500">Manage your account settings and personal information.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center space-x-3">
                    <BadgeInfo className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-medium text-slate-900">Personal Information</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-4 border-b pb-4">
                        <div className="bg-indigo-100 p-3 rounded-full text-primary shrink-0">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Full Name</p>
                            <p className="text-lg font-bold text-slate-800">{user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 p-3 rounded-full text-primary shrink-0">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Email Address</p>
                            <p className="text-lg font-bold text-slate-800">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden mt-8 shadow-sm">
                <div className="px-6 py-5 flex items-center space-x-3 bg-red-100">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
                </div>
                <div className="p-6">
                    <p className="text-red-700 text-sm mb-4">
                        Permanently delete your account and all associated data including uploaded resumes and AI analyses. This action cannot be reversed.
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="bg-red-600 text-white px-5 py-2.5 rounded-lg border border-red-700 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 font-medium text-sm"
                    >
                        {loading ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
