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
    ChartBarIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formToDelete, setFormToDelete] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // const token = localStorage.getItem('token');
        // const storedUser = localStorage.getItem('user');

        // if (!token) {
        //     window.location.href = '/login';
        //     return;
        // }

        // if (storedUser) {
        //     setUser(JSON.parse(storedUser));
        // }
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

    const acceptingForms = forms.filter(form => form.acceptingResponses);
      const nonAcceptingForms = forms.filter(form => !form.acceptingResponses);


    const handleDeleteClick = (id) => {
        setFormToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:5000/${formToDelete}`);
            setForms(forms.filter(form => form._id !== formToDelete));
            setSuccessMessage('Form deleted successfully');
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 3000);
        } catch (err) {
            setError('Failed to delete form. Please try again.');
            console.error(err);
        } finally {
            setShowDeleteModal(false);
            setFormToDelete(null);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Loading your forms...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                        <XCircleIcon className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 relative">
            {/* Success Alert */}
            {showSuccessAlert && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg max-w-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{successMessage}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={() => setShowSuccessAlert(false)}
                                    className="text-green-500 hover:text-green-600"
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Delete form</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to delete this form? This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setFormToDelete(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div className="mb-6 sm:mb-0">
                        <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Welcome to Your Dashboard
                        </h1>
                        <p className="mt-3 text-lg text-gray-600">
                            Create, manage, and analyze your forms with ease
                        </p>
                    </div>
                    <Link
                        to="/forms/create"
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105"
                    >
                        <DocumentPlusIcon className="mr-3 h-6 w-6" />
                        Create New Form
                    </Link>
                </div>

                {forms.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
                        <div className="bg-blue-100 p-4 rounded-full inline-flex items-center justify-center">
                            <DocumentPlusIcon className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="mt-6 text-2xl font-bold text-gray-900">No forms created yet</h3>
                        <p className="mt-3 text-lg text-gray-500">
                            Start by creating your first form to collect responses and analyze data.
                        </p>
                        <div className="mt-8">
                            <Link
                                to="/forms/create"
                                className="inline-flex items-center px-8 py-3 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105"
                            >
                                <DocumentPlusIcon className="mr-3 h-6 w-6" />
                                Create First Form
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                                    <p className="text-sm font-medium text-blue-600">Total Forms</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">{forms.length}</p>
                                </div>
                                <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
                                    <p className="text-sm font-medium text-purple-600">Inactive Forms</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">{nonAcceptingForms.length}</p>
                                </div>
                                <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                                    <p className="text-sm font-medium text-green-600">Active Forms</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">{acceptingForms.length}</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Forms</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {forms.map((form) => (
                                <div key={form._id} className="bg-white overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                    {form.headerImage && (
                                        <div className="h-40 bg-gray-200 overflow-hidden">
                                            <img
                                                src={form.headerImage}
                                                alt="Form header"
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                            />
                                        </div>
                                    )}
                                    <div className="px-5 py-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-xl font-bold text-gray-900 mb-1">{form.title}</h2>
                                                <p className="text-sm text-gray-500">
                                                    Created {new Date(form.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <Link
                                                to={`/forms/${form._id}`}
                                                className="ml-4 flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <ArrowUpRightIcon className="h-6 w-6" />
                                            </Link>
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {form.questions.some(q => q.type === 'categorize') && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    <PuzzlePieceIcon className="mr-1.5 h-3.5 w-3.5" />
                                                    Categorize
                                                </span>
                                            )}
                                            {form.questions.some(q => q.type === 'cloze') && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    <DocumentTextIcon className="mr-1.5 h-3.5 w-3.5" />
                                                    Cloze
                                                </span>
                                            )}
                                            {form.questions.some(q => q.type === 'comprehension') && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <BookOpenIcon className="mr-1.5 h-3.5 w-3.5" />
                                                    Comprehension
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-6 flex justify-between items-center">
                                            <div className="flex space-x-2">
                                                <Link
                                                    to={`/forms/${form._id}/edit`}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                >
                                                    <PencilIcon className="mr-1.5 h-4 w-4 text-gray-600" />
                                                    Edit
                                                </Link>
                                                <Link
                                                    to={`/forms/${form._id}/responses`}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                >
                                                    <ChartBarIcon className="mr-1.5 h-4 w-4 text-green-600" />
                                                    Responses
                                                </Link>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteClick(form._id)}
                                                className="inline-flex items-center px-3 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                            >
                                                <TrashIcon className="mr-1.5 h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}