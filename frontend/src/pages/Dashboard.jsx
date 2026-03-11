import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend
);

const Dashboard = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/resume/history');
                setHistory(res.data.data.slice(0, 5)); // Get latest 5
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const latestResume = history.length > 0 ? history[0] : null;

    const lineChartData = {
        labels: [...history].reverse().map(r => new Date(r.createdAt).toLocaleDateString()),
        datasets: [
            {
                label: 'ATS Score Trend',
                data: [...history].reverse().map(r => r.atsScore),
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                tension: 0.3,
            },
        ],
    };

    const doughnutData = {
        labels: ['Matched Skills', 'Skill Gaps'],
        datasets: [
            {
                data: [75, 25],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 0,
            },
        ],
    };

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name.split(' ')[0]}</h1>
                <Link to="/upload" className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
                    Upload New Resume
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Latest Score Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Latest ATS Score</h3>
                        <div className="mt-2 text-4xl font-extrabold text-slate-900">
                            {latestResume ? `${latestResume.atsScore}/100` : 'N/A'}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Based on your recent upload.</p>
                    </div>
                    {latestResume && (
                        <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${latestResume.atsScore}%` }}
                            ></div>
                        </div>
                    )}
                </div>

                {/* Job Match Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Top Job Match</h3>
                        <div className="mt-2 text-2xl font-bold text-slate-900">
                            Software Engineer
                        </div>
                        <p className="mt-1 text-sm text-green-600 font-medium">85% Compatibility</p>
                    </div>
                    <Link to="/jobs" className="mt-4 text-sm text-primary font-medium hover:underline">View all matches &rarr;</Link>
                </div>

                {/* Action Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between items-start bg-gradient-to-br from-indigo-50 to-white">
                    <div>
                        <h3 className="text-slate-800 text-lg font-bold">Prepare for interviews</h3>
                        <p className="text-sm text-slate-600 mt-1">Get AI generated questions based on your specific resume and target job.</p>
                    </div>
                    <Link to="/interview" className="mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800">
                        Start Practice
                    </Link>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">ATS Score Trend</h3>
                    {history.length > 0 ? (
                        <div className="h-64">
                            <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-slate-400">No data available</div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Overall Skill Gap Summary</h3>
                    <div className="h-64 flex items-center justify-center">
                        <div className="w-1/2">
                            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '70%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
