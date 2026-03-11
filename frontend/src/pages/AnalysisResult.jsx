import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { LayoutDashboard, AlertTriangle, CheckCircle, ChevronRight, BarChart2 } from 'lucide-react';

const AnalysisResult = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resumeRes = await api.get(`/resume/${id}`);
                setResume(resumeRes.data.data);

                // Fetch or Generate AI Analysis
                const aiRes = await api.post('/ai/analyze-resume', { resumeId: id });
                setAnalysis(aiRes.data.data);
            } catch (err) {
                setError(err.response?.data?.message || err.response?.data?.error || 'Failed to analyze resume.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Crunching numbers with AI...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Link to="/dashboard" className="hover:text-primary transition flex items-center">
                        <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-800 font-medium">Analysis Report</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ATS Score Overview */}
                <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center space-x-2 mb-4 text-slate-700">
                        <BarChart2 className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-semibold text-lg">Overall ATS Score</h3>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-4 py-6">
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="56" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                                <circle
                                    cx="64" cy="64" r="56" fill="transparent"
                                    stroke={resume?.atsScore > 75 ? '#10b981' : resume?.atsScore > 50 ? '#f59e0b' : '#ef4444'}
                                    strokeWidth="12"
                                    strokeDasharray={`${(resume?.atsScore / 100) * 351} 351`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-800">
                                {resume?.atsScore}
                            </div>
                        </div>

                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${resume?.atsScore > 75 ? 'bg-green-100 text-green-700' :
                                resume?.atsScore > 50 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                            }`}>
                            {resume?.atsScore > 75 ? 'Excellent Formatting' : resume?.atsScore > 50 ? 'Needs Improvement' : 'Critical Issues Detected'}
                        </span>
                    </div>
                </div>

                {/* AI Suggestions */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center space-x-2 mb-4 text-slate-700">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h3 className="font-semibold text-lg">AI Improvement Suggestions</h3>
                    </div>

                    <ul className="space-y-3 flex-1 overflow-y-auto pr-2">
                        {analysis?.suggestions?.length > 0 ? analysis.suggestions.map((sug, i) => (
                            <li key={i} className="flex space-x-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span>{sug}</span>
                            </li>
                        )) : (
                            <li className="text-slate-500 text-sm">No suggestions available.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResult;
