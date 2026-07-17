"use client";
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';
// Type for the submission data from Firestore
type Submission = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    year: string;
    branch: string;
    firstChoice: string;
    secondChoice: string;
    motivation: string;
    contribution: string;
    additionalInfo?: string;
    submittedAt?: {
        seconds: number;
        nanoseconds: number;
    };
};

// Component to display full submission details in a modal
const SubmissionModal = ({ submission, onClose }: { submission: Submission, onClose: () => void }) => {
    // Converts the Firestore timestamp to a readable local date and time string.
    // If submittedAt is missing, it displays 'Date not available'.
    const submittedDate = submission.submittedAt && typeof submission.submittedAt.seconds === 'number'
        ? new Date(submission.submittedAt.seconds * 1000).toLocaleString()
        : 'Date not available';
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-blue-500/10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{submission.fullName}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                <div className="space-y-4 text-slate-300">
                    <p><strong>Email:</strong> {submission.email}</p>
                    <p><strong>Phone:</strong> {submission.phoneNumber}</p>
                    <p><strong>Submitted On:</strong> {submittedDate}</p>
                    <hr className="border-slate-700" />
                    <p><strong>Year & Branch:</strong> {submission.year} Year, {submission.branch}</p>
                    <p><strong>1st Domain Choice:</strong> {submission.firstChoice}</p>
                    <p><strong>2nd Domain Choice:</strong> {submission.secondChoice}</p>
                    <hr className="border-slate-700" />
                    <div>
                        <h3 className="font-semibold text-white mb-2">Motivation:</h3>
                        <p className="bg-slate-900/50 p-3 rounded-lg whitespace-pre-wrap">{submission.motivation}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Contribution:</h3>
                        <p className="bg-slate-900/50 p-3 rounded-lg whitespace-pre-wrap">{submission.contribution}</p>
                    </div>
                    {submission.additionalInfo && (
                        <div>
                            <h3 className="font-semibold text-white mb-2">Additional Information:</h3>
                            <p className="bg-slate-900/50 p-3 rounded-lg whitespace-pre-wrap">{submission.additionalInfo}</p>
                        </div>
                    )}
                </div>
                <div className="text-right mt-8">
                    <button onClick={onClose} className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};
// Main Admin Dashboard Component
export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDomain, setFilterDomain] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // 'desc' for newest first
    // Fetch submissions from the API route when the user is authenticated
    useEffect(() => {
        const fetchSubmissions = async () => {

            setIsLoading(true);
            try {
                const res = await fetch('/api/get-submissions');
                if (!res.ok) {
                    throw new Error('Failed to fetch submissions. You may not have permission.');
                }
                const data = await res.json();
                setSubmissions(data);
            }  catch (err) {
                 if (err instanceof Error) {
                 setError(err.message);
                } else {
                 setError('An unexpected error occurred.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        if (status === 'authenticated') {

            fetchSubmissions();
        } else if (status === 'unauthenticated') {
            setIsLoading(false);
        }
    }, [status]);
    // Check if the signed-in user's email is in the admin list from environment variables
    const isAdmin = () => {
        if (!session || !session.user?.email) return false;
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
        return adminEmails.includes(session.user.email);
    };
    //  calculation for filtering and sorting the submissions list
    const sortedAndFilteredSubmissions = useMemo(() => submissions
        .filter(sub => 
            sub.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(sub => 
            filterDomain ? sub.firstChoice === filterDomain || sub.secondChoice === filterDomain : true
        )
        .sort((a, b) => {
            const dateA = a.submittedAt ? a.submittedAt.seconds : 0;
            const dateB = b.submittedAt ? b.submittedAt.seconds : 0;
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        }),
        [submissions, searchTerm, filterDomain, sortOrder]
    );
    const domainOptions = [
        "Event Planning and Coordination", "Public Relation and Outreach", "Graphic Design and Visual Content",
        "Photography and Media Coverage", "Content Writing and Editorial", "Web Dev and Management",
        "Video Production and Editing", "Social Media Strategy and Management" , "Workflow Management"
    ];
    if (status === "loading") {
        return <p className="flex items-center justify-center min-h-screen text-slate-400">Loading Session...</p>
    }
    if (status === "unauthenticated") {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                 <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
                 <p className="text-xl text-slate-400 mb-8">You must be signed in to view this page.</p>
                 <button onClick={() => signIn('google')} className="bg-blue-600 text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                     Sign In with Google
                 </button>
             </div>
        );
    }
    if (!isAdmin()) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <h1 className="text-4xl font-bold mb-4 text-red-500">Access Denied</h1>
                <p className="text-xl text-slate-400 mb-8">You do not have permission to view this page.</p>
                <Link href="/" className="text-blue-400 hover:underline">Go back to Home</Link>
            </div>
        );
    }
    return (
        <div className="p-4 sm:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-slate-400 text-lg">Total Submissions</h3>
                    <p className="text-4xl font-bold text-white">{submissions.length}</p>
                </div>
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-slate-400 text-lg">Filtered Results</h3>
                    <p className="text-4xl font-bold text-white">{sortedAndFilteredSubmissions.length}</p>
                </div>
                 <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-slate-400 text-lg">Admins</h3>
                    <p className="text-4xl font-bold text-white">{process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').length || 0}</p>
                </div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center">
                <input 
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-auto flex-grow bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"

                />
                <select 
                    value={filterDomain}
                    onChange={(e) => setFilterDomain(e.target.value)}
                    className="w-full md:w-auto flex-grow bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                    <option value="">Filter by Domain</option>
                    {domainOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <button
                    onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="w-full md:w-auto flex-shrink-0 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 flex items-center justify-center gap-2 hover:bg-slate-700/50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    <span>Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
                </button>
            </div>
            <div className="overflow-x-auto bg-slate-800/40 rounded-2xl border border-slate-700">
                {isLoading ? <p className="p-8 text-center">Loading submissions...</p> :
                 error ? <p className="p-8 text-center text-red-500">{error}</p> :
                 sortedAndFilteredSubmissions.length === 0 ? <p className="p-8 text-center">No submissions found.</p> :
                (
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="p-4 font-semibold">S.No.</th>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold hidden sm:table-cell">Email</th>
                                <th className="p-4 font-semibold hidden md:table-cell">Year</th>
                                <th className="p-4 font-semibold">First Choice</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredSubmissions.map((sub, index) => (
                                <tr key={sub.id} className="border-t border-slate-700 hover:bg-slate-800/70 transition-colors">
                                    <td className="p-4 text-slate-400">{index + 1}</td>
                                    <td className="p-4 font-medium">{sub.fullName}</td>
                                    <td className="p-4 hidden sm:table-cell text-slate-400">{sub.email}</td>
                                    <td className="p-4 hidden md:table-cell text-slate-400">{sub.year}</td>
                                    <td className="p-4 text-slate-300">{sub.firstChoice}</td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => setSelectedSubmission(sub)} 
                                            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {selectedSubmission && (
                <SubmissionModal 
                    submission={selectedSubmission} 
                    onClose={() => setSelectedSubmission(null)} 
                />
            )}
        </div>
    );
};