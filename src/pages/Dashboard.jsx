import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    TrashIcon,
    PencilIcon,
    DocumentPlusIcon,
    PuzzlePieceIcon,
    DocumentTextIcon,
    BookOpenIcon,
    ArrowUpRightIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);



    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        // console.log(localStorage.getItem('user'));
        // console.log(storedUser);

        if (!token) {
            window.location.href = '/login'; // redirect if not logged in
            return;
        }

        if (storedUser) {
            setUser(JSON.parse(storedUser)); // load from localStorage
        }
        const fetchForms = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/forms');
                setForms(data);
            } catch (err) {
                setError('Failed to fetch forms. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchForms();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:5000/${id}`);
                setForms(forms.filter(form => form._id !== id));
                // Optional: Show success message
                alert('Form deleted successfully');
            } catch (err) {
                setError('Failed to delete form. Please try again.');
                console.error(err);
            }
        }
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

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Create, manage, and analyze your forms
                        </p>
                    </div>
                    <Link
                        to="/forms/create"
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <DocumentPlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Create New Form
                    </Link>
                </div>

                {forms.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <DocumentPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No forms yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating a new form.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/forms/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <DocumentPlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                Create First Form
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {forms.map((form) => (
                            <div key={form._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                                {form.headerImage && (
                                    <div className="h-32 bg-gray-200 overflow-hidden">
                                        <img
                                            src={form.headerImage}
                                            alt="Form header"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-lg font-medium text-gray-900 truncate">{form.title}</h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Created on {new Date(form.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/forms/${form._id}`}
                                            className="ml-4 flex-shrink-0 text-blue-600 hover:text-blue-800"
                                        >
                                            <ArrowUpRightIcon className="h-5 w-5" />
                                        </Link>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {form.questions.some(q => q.type === 'categorize') && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                <PuzzlePieceIcon className="mr-1 h-3 w-3" />
                                                Categorize
                                            </span>
                                        )}
                                        {form.questions.some(q => q.type === 'cloze') && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <DocumentTextIcon className="mr-1 h-3 w-3" />
                                                Cloze
                                            </span>
                                        )}
                                        {form.questions.some(q => q.type === 'comprehension') && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <BookOpenIcon className="mr-1 h-3 w-3" />
                                                Comprehension
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-5 flex justify-between items-center">
                                        <div className="flex space-x-3">
                                            <Link
                                                to={`/forms/${form._id}/edit`}
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <PencilIcon className="-ml-1 mr-1.5 h-4 w-4 text-gray-500" />
                                                Edit
                                            </Link>
                                            <Link
                                                to={`/forms/${form._id}/responses`}
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                <ChartBarIcon className="-ml-1 mr-1.5 h-4 w-4 text-green-500" />
                                                Responses
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(form._id)}
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <TrashIcon className="-ml-1 mr-1.5 h-4 w-4 text-red-500" />
                                                Delete
                                            </button>
                                        </div>
                                        <Link
                                            to={`/forms/${form._id}`}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            View details
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}