import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  TrashIcon, 
  PencilIcon, 
  DocumentPlusIcon,
  PuzzlePieceIcon,
  DocumentTextIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await axios.delete(`/api/forms/${id}`);
        setForms(forms.filter(form => form._id !== id));
      } catch (err) {
        setError('Failed to delete form. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Forms</h1>
        <Link
          to="/forms/create"
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
        >
          {/* <DocumentPlusIcon className="h-4 w-4" /> */}
          <span>Create New</span>
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-3 text-sm">You haven't created any forms yet.</p>
          <Link
            to="/forms/create"
            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
          >
            <DocumentPlusIcon className="h-4 w-4" />
            <span>Create First Form</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <div key={form._id} className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-100">
              {form.headerImage && (
                <div className="h-24 overflow-hidden">
                  <img 
                    src={form.headerImage} 
                    height={100}
                    alt="Form header" 
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-3">
                <h2 className="text-base font-medium text-gray-800 mb-1 line-clamp-1">{form.title}</h2>
                <p className="text-gray-500 text-xs mb-2">
                  {new Date(form.createdAt).toLocaleDateString()}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {form.questions.some(q => q.type === 'categorize') && (
                    <span className="inline-flex items-center text-[0.65rem] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                      <PuzzlePieceIcon style={{ width: '12px', height: '12px' }} />
                      <span>Categorize</span>
                    </span>
                  )}
                  {form.questions.some(q => q.type === 'cloze') && (
                    <span className="inline-flex items-center text-[0.65rem] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                      <DocumentTextIcon style={{ width: '12px', height: '12px' }} />
                      <span>Cloze</span>
                    </span>
                  )}
                  {form.questions.some(q => q.type === 'comprehension') && (
                    <span className="inline-flex items-center text-[0.65rem] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                      <BookOpenIcon style={{ width: '12px', height: '12px' }} />
                      <span>Comprehension</span>
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs">
                  <Link
                    to={`/forms/${form._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>
                  <div className="flex gap-2">
                    <Link
                      to={`/forms/${form._id}/edit`}
                      className="flex items-center gap-0.5 text-gray-600 hover:text-gray-800"
                    >
                      <PencilIcon style={{ width: '12px', height: '12px' }} />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(form._id)}
                      className="flex items-center gap-0.5 text-red-600 hover:text-red-800"
                    >
                      <TrashIcon style={{ width: '12px', height: '12px' }} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}