import React, { useState } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const UploadResume = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && (selected.type === 'application/pdf' || selected.name.endsWith('.docx'))) {
            setFile(selected);
            setError(null);
        } else {
            setFile(null);
            setError('Please upload a valid PDF or DOCX file.');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Redirect to analysis page with resume ID
            navigate(`/analysis/${res.data.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to upload resume.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Upload Resume</h2>
                <p className="mt-1 text-slate-500">Upload your PDF or DOCX resume to analyze ATS score and get insights.</p>
            </div>

            <div
                className={`mt-4 border-2 border-dashed rounded-xl p-12 text-center transition ${file ? 'border-primary bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 bg-white'
                    }`}
            >
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
                        <UploadCloud className="w-8 h-8" />
                    </div>

                    <div className="text-slate-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                            <span>Upload a file</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept=".pdf,.docx"
                                onChange={handleFileChange}
                            />
                        </label>
                        <p className="pl-1 inline">or drag and drop</p>
                    </div>

                    <p className="text-xs text-slate-500">
                        PDF, DOCX up to 5MB
                    </p>
                </div>
            </div>

            {error && (
                <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {file && !error && (
                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3 text-slate-700">
                        <File className="w-6 h-6 text-slate-400" />
                        <span className="font-medium text-sm">{file.name}</span>
                        <span className="text-xs text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                    {loading ? 'Analyzing...' : 'Analyze Document'}
                </button>
            </div>
        </div>
    );
};

export default UploadResume;
