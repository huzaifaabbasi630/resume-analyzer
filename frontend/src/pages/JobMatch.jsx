import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Briefcase, Building, ChevronRight, Hash } from 'lucide-react';

const JobMatch = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                // Here we just fetch the latest resume ID for demonstration
                const resHistory = await api.get('/resume/history');
                if (resHistory.data.data.length === 0) {
                    setError('Please upload a resume first to get job matches.');
                    setLoading(false);
                    return;
                }

                const latestResumeId = resHistory.data.data[0]._id;
                const resMatches = await api.post('/ai/job-match', { resumeId: latestResumeId });
                setMatches(resMatches.data.data.jobMatches || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch job matches.');
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse text-slate-500 font-medium">Analyzing your profile for the best roles...</div>;
    if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Job Matches</h2>
                    <p className="mt-1 text-slate-500">Based on your latest resume, here are the roles where you have the highest chance of success.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {matches.map((match, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200 p-6 flex flex-col group">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-indigo-50 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 leading-tight">{match}</h3>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                            <span className="flex items-center"><Building className="w-4 h-4 mr-1 text-slate-400" /> Start Applying</span>
                            <ChevronRight className="w-4 h-4 group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                ))}
                {matches.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        No matches found. Try uploading a more detailed resume.
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobMatch;
