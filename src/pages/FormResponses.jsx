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
    EnvelopeIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    DocumentTextIcon,
    PuzzlePieceIcon,
    BookOpenIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function FormResponses() {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formResponses, setFormResponses] = useState([]);
    const [showResponses, setShowResponses] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        dateRange: { start: null, end: null },
        scoreRange: { min: 0, max: 100 },
        user: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL || '$http://localhost:5000';


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/${id}/responses`);
                setFormData(response.data);
                setFormResponses(response.data.responses || []);
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
        console.log(`Exporting to ${format}`);
    };

    const getQuestionById = (questionId) => {
        if (!formData?.form?.questions) return null;
        return formData.form.questions.find(q => q._id === questionId);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md w-full">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!formData) return null;

    const { form, responses: submissions, statistics } = formData;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        <ArrowLeftIcon className="mr-1 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Overview Section */}
                <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
                    <div className="px-6 py-5 sm:px-8 sm:py-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
                                <p className="mt-1 text-sm text-gray-600">{form.description}</p>
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <CalendarIcon className="mr-1 h-4 w-4" />
                                        Created: {new Date(form.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center">
                                        <CalendarIcon className="mr-1 h-4 w-4" />
                                        Updated: {new Date(form.updatedAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center">
                                        <DocumentTextIcon className="mr-1 h-4 w-4" />
                                        Questions: {form.questions?.length || 0}
                                    </span>
                                </div>
                            </div>
                            {/* <div className="flex gap-3">
                                <button
                                    onClick={() => handleExport('csv')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                                    Export CSV
                                </button>
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                >
                                    <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                                    Export PDF
                                </button>
                            </div> */}
                        </div>

                        {/* Statistics Cards */}
                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-5 sm:p-6 rounded-lg border border-blue-100">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                        <ChartBarIcon className="h-6 w-6" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                                        <p className="mt-1 text-2xl font-semibold text-gray-900">{statistics.totalSubmissions}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 px-4 py-5 sm:p-6 rounded-lg border border-green-100">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                                        <CheckCircleIcon className="h-6 w-6" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Average Score</p>
                                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                                            {statistics.averageScore} / {statistics.maxPossibleScore}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-green-600">
                                            ({statistics.averagePercentage}%)
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-5 sm:p-6 rounded-lg border border-purple-100">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                        <UserIcon className="h-6 w-6" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Unique Respondents</p>
                                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                                            {statistics.uniqueRespondents}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 px-4 py-5 sm:p-6 rounded-lg border border-amber-100">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                                        <DocumentTextIcon className="h-6 w-6" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Highest Score</p>
                                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                                            {statistics.highestScore} / {statistics.maxPossibleScore}
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
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-lg font-medium text-gray-900">Responses</h2>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
                                <div className="relative">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`inline-flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <FunnelIcon className="mr-2 h-4 w-4" />
                                        Filters
                                        <ChevronDownIcon className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
                                    </button>

                                    {showFilters && (
                                        <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-white rounded-md shadow-lg p-4 z-10 border border-gray-200">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-sm font-medium text-gray-900">Filter Responses</h3>
                                                <button
                                                    onClick={() => setShowFilters(false)}
                                                    className="text-gray-400 hover:text-gray-500"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="date"
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                                            value={filters.dateRange.start || ''}
                                                            onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })}
                                                        />
                                                        <span className="flex items-center">to</span>
                                                        <input
                                                            type="date"
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                                            value={filters.dateRange.end || ''}
                                                            onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Score Range</label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                                            placeholder="Min"
                                                            value={filters.scoreRange.min}
                                                            onChange={(e) => setFilters({ ...filters, scoreRange: { ...filters.scoreRange, min: e.target.value } })}
                                                        />
                                                        <span>-</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                                            placeholder="Max"
                                                            value={filters.scoreRange.max}
                                                            onChange={(e) => setFilters({ ...filters, scoreRange: { ...filters.scoreRange, max: e.target.value } })}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Respondent</label>
                                                    <input
                                                        type="text"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                                        placeholder="Search by respondent"
                                                        value={filters.user}
                                                        onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-end gap-2">
                                                <button
                                                    onClick={() => setFilters({
                                                        search: '',
                                                        dateRange: { start: null, end: null },
                                                        scoreRange: { min: 0, max: 100 },
                                                        user: ''
                                                    })}
                                                    className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    onClick={() => setShowFilters(false)}
                                                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
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
                                        Respondent
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
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
                                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedSubmission?._id === submission._id ? 'bg-blue-50' : ''}`}
                                        onClick={() => setSelectedSubmission(submission)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <UserIcon className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {submission.submittedBy?.name || submission.respondentName || 'Anonymous'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {submission.submittedBy?.email || submission.respondentEmail || 'No email provided'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(submission.submittedAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(submission.submittedAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-16 mr-2">
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500"
                                                            style={{ width: `${submission.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {submission.score}/{submission.maxScore}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${submission.percentage >= 80 ? 'bg-green-100 text-green-800' :
                                                    submission.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {submission.percentage >= 80 ? 'Excellent' :
                                                    submission.percentage >= 50 ? 'Average' : 'Needs Improvement'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="text-blue-600 hover:text-blue-900"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedSubmission(submission);
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Previous
                            </button>
                            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                                    <span className="font-medium">{submissions.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                    <button aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        1
                                    </button>
                                    <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        2
                                    </button>
                                    <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        3
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        ...
                                    </span>
                                    <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        8
                                    </button>
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Next</span>
                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Response View (Side Panel) */}
                {selectedSubmission && (
                    <div className="fixed inset-0 overflow-hidden z-50">
                        <div className="absolute inset-0 overflow-hidden">
                            <div
                                className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                onClick={() => setSelectedSubmission(null)}
                            ></div>
                            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                                <div className="w-screen max-w-2xl">
                                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                                        <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <h2 className="text-lg font-medium text-gray-900">
                                                    Submission Details
                                                </h2>
                                                <button
                                                    type="button"
                                                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    onClick={() => setSelectedSubmission(null)}
                                                >
                                                    <span className="sr-only">Close panel</span>
                                                    <XMarkIcon className="h-6 w-6" />
                                                </button>
                                            </div>

                                            <div className="mt-8">
                                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg mb-6 border border-blue-200">
                                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                        <div>
                                                            <h3 className="text-lg font-medium text-gray-900">Submission Summary</h3>
                                                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                                <p className="flex items-center">
                                                                    <UserIcon className="mr-2 h-4 w-4" />
                                                                    {selectedSubmission.submittedBy?.name || selectedSubmission.respondentName || 'Anonymous Respondent'}
                                                                </p>
                                                                <p className="flex items-center">
                                                                    <EnvelopeIcon className="mr-2 h-4 w-4" />
                                                                    {selectedSubmission.submittedBy?.email || selectedSubmission.respondentEmail || 'No email provided'}
                                                                </p>
                                                                <p className="flex items-center">
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 min-w-[180px]">
                                                            <div className="text-center">
                                                                <div className="text-3xl font-bold text-blue-600">
                                                                    {selectedSubmission.percentage}%
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {selectedSubmission.score} / {selectedSubmission.maxScore} points
                                                                </div>
                                                            </div>
                                                            <div className="mt-2">
                                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                                                                        style={{ width: `${selectedSubmission.percentage}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    {selectedSubmission.responses && Object.entries(selectedSubmission.responses).map(([questionId, answer]) => {
                                                        const question = getQuestionById(questionId);
                                                        return (
                                                            <div key={questionId} className="border border-gray-200 rounded-lg p-4">
                                                                <div className="mb-4">
                                                                    <div className="flex justify-between items-start">
                                                                        <h3 className="text-md font-medium text-gray-900 mb-2">
                                                                            {question ? question.questionText : `Question ID: ${questionId}`}
                                                                        </h3>
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {question?.points || 0} pts
                                                                        </span>
                                                                    </div>
                                                                    {question && (
                                                                        <div className="text-xs text-gray-500 mb-2 flex items-center">
                                                                            <PuzzlePieceIcon className="mr-1 h-3 w-3" />
                                                                            {question.type}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="mt-4">
                                                                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                                        <BookOpenIcon className="mr-1 h-4 w-4" />
                                                                        Respondent's Answer
                                                                    </h4>
                                                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                                                        {Array.isArray(answer) ? (
                                                                            question?.type === 'categorize' ? (
                                                                                <div className="space-y-2">
                                                                                    {answer.map((item, index) => {
                                                                                        const questionItem = question.items?.find(qItem => qItem.id === item.itemId);
                                                                                        return (
                                                                                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                                                                                <span className="font-medium">{questionItem?.text || `Item ${item.itemId}`}</span>
                                                                                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                                                                    {item.category}
                                                                                                </span>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            ) : question?.type === 'cloze' ? (
                                                                                <div className="space-y-1">
                                                                                    {answer.map((item, index) => (
                                                                                        <div key={index} className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mr-2">
                                                                                            {item}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            ) : question?.type === 'comprehension' ? (
                                                                                <div className="space-y-1">
                                                                                    {answer.map((item, index) => (
                                                                                        <div key={index} className="px-3 py-2 bg-purple-100 text-purple-800 rounded border-l-4 border-purple-400">
                                                                                            {item}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <ul className="list-disc list-inside space-y-1">
                                                                                    {answer.map((item, index) => (
                                                                                        <li key={index}>
                                                                                            {typeof item === 'object' ? JSON.stringify(item, null, 2) : item}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            )
                                                                        ) : (
                                                                            <div className="text-sm text-gray-900 p-2 bg-white rounded border">
                                                                                {typeof answer === 'object' ? JSON.stringify(answer, null, 2) : answer}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-200 py-4 px-4 sm:px-6">
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    onClick={() => setSelectedSubmission(null)}
                                                >
                                                    Close
                                                </button>
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