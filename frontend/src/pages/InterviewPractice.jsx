import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { MessageSquare, Users, Edit3, BookmarkPlus } from 'lucide-react';

const InterviewPractice = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const resHistory = await api.get('/resume/history');
                if (resHistory.data.data.length === 0) {
                    setError('Please upload a resume first.');
                    setLoading(false);
                    return;
                }

                const latestResumeId = resHistory.data.data[0]._id;
                const resAi = await api.post('/ai/interview-questions', { resumeId: latestResumeId });
                setQuestions(resAi.data.data.questions || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch interview questions.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse text-slate-500 font-medium">Generating interview scenarios...</div>;
    if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-lg">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Interview Prep</h2>
                    <p className="mt-1 text-slate-500">Practice questions generated specifically for your resume and skill set.</p>
                </div>
            </div>

            <div className="space-y-6 mt-6">
                {questions.map((q, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                        <div className={`px-6 py-4 border-b flex items-start justify-between ${q.type === 'Technical' ? 'bg-blue-50/50' : 'bg-purple-50/50'}`}>
                            <div className="flex items-center space-x-3">
                                {q.type === 'Technical' ? <Edit3 className="text-blue-600 w-5 h-5 bg-white p-1 rounded-sm shadow-sm" /> : <Users className="text-purple-600 w-5 h-5 bg-white p-1 rounded-sm shadow-sm" />}
                                <span className={`text-sm font-semibold tracking-wide uppercase ${q.type === 'Technical' ? 'text-blue-700' : 'text-purple-700'}`}>
                                    {q.type} Question
                                </span>
                            </div>
                            <button className="text-slate-400 hover:text-primary transition"><BookmarkPlus className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">{q.question}</h3>
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex space-x-3">
                                <MessageSquare className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Suggested Approach</span>
                                    <p className="text-sm text-slate-700 leading-relaxed">{q.suggestedAnswer}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {questions.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        No practice questions found. Update your resume.
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewPractice;
