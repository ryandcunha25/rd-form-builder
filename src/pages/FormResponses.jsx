import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeftIcon,
    ArrowDownTrayIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ChartBarIcon,
    CalendarIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    PuzzlePieceIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';

export default function FormResponses() {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        dateRange: { start: null, end: null },
        scoreRange: { min: 0, max: 100 },
        user: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/${id}/responses`);
                console.log('API Response:', response.data);
                setFormData(response.data);
            } catch (err) {
                setError('Failed to fetch data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleExport = (format) => {
        // Implement export functionality
        console.log(`Exporting to ${format}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!formData) return null;

    const { form, responses: submissions, statistics } = formData;
    console.log('Form Data:', formData);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link to="/dashboard" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                        <ArrowLeftIcon className="mr-1 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Overview Section */}
                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-6 py-5 sm:px-8 sm:py-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
                                <p className="mt-1 text-sm text-gray-600">{form.description}</p>
                                <div className="mt-3 flex items-center text-sm text-gray-500">
                                    <span>Created by: </span>
                                    <span className="ml-1">
                                        {form.createdBy?.name || form.createdBy?.email || 'Unknown'}
                                    </span>
                                </div>
                                <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span>Created: {new Date(form.createdAt).toLocaleString()}</span>
                                    <span>Last updated: {new Date(form.updatedAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0 flex space-x-3">
                                <button
                                    onClick={() => handleExport('csv')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                                    Export CSV
                                </button>
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                                    Export PDF
                                </button>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="bg-blue-50 px-4 py-5 sm:p-6 rounded-lg">
                                <div className="flex items-center">
                                    <ChartBarIcon className="h-8 w-8 text-blue-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                                        <p className="mt-1 text-2xl font-semibold text-gray-900">{statistics.totalSubmissions}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 px-4 py-5 sm:p-6 rounded-lg">
                                <div className="flex items-center">
                                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Average Score</p>
                                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                                            {statistics.averageScore}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-purple-50 px-4 py-5 sm:p-6 rounded-lg">
                                <div className="flex items-center">
                                    <UserIcon className="h-8 w-8 text-purple-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Unique Respondents</p>
                                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                                            {statistics.uniqueRespondents}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="px-6 py-4 sm:px-8 sm:py-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Responses</h2>
                            <div className="flex space-x-3 w-full sm:w-auto">
                                <div className="relative rounded-md shadow-sm w-full sm:w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md py-2"
                                        placeholder="Search responses..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    />
                                </div>
                                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                    <FunnelIcon className="mr-2 h-4 w-4" />
                                    Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Responses List */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submission ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Responses
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {submissions.map((submission) => (
                                    <tr
                                        key={submission._id}
                                        className={`hover:bg-gray-50 cursor-pointer ${selectedSubmission?._id === submission._id ? 'bg-blue-50' : ''}`}
                                        onClick={() => setSelectedSubmission(submission)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {submission._id.substring(0, 8)}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(submission.submittedAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {submission.responses ? Object.keys(submission.responses).length : 0} questions answered
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-4">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detailed Response View (Side Panel) */}
                {selectedSubmission && (
                    <div className="fixed inset-0 overflow-hidden z-50">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedSubmission(null)}></div>
                            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                                <div className="w-screen max-w-2xl">
                                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                                        <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <h2 className="text-lg font-medium text-gray-900">
                                                    Submission Details
                                                </h2>
                                                <div className="ml-3 h-7 flex items-center">
                                                    <button
                                                        type="button"
                                                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        onClick={() => setSelectedSubmission(null)}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h3 className="text-lg font-medium text-gray-900">Submission Information</h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                ID: {selectedSubmission._id}
                                                            </p>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-8">
                                                    {selectedSubmission.responses && Object.entries(selectedSubmission.responses).map(([questionId, answer]) => (
                                                        <div key={questionId} className="border-b border-gray-200 pb-6 last:border-0">
                                                            <h3 className="text-md font-medium text-gray-900 mb-2">
                                                                Question ID: {questionId}
                                                            </h3>
                                                            <div className="mt-4">
                                                                <h4 className="text-sm font-medium text-gray-700 mb-2">User's Answer:</h4>
                                                                <div className="p-3 bg-gray-50 rounded-md">
                                                                    <pre className="text-sm text-gray-900 overflow-x-auto">
                                                                        {JSON.stringify(answer, null, 2)}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}