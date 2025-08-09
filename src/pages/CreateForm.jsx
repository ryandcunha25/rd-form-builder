import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FieldEditor from './components/FieldEditor';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/solid';


export default function CreateForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    headerImage: '',
    questions: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, upload to Cloudinary or similar service
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({...formData, headerImage: event.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      questionText: '',
      required: false,
      points: 1
    };

    // Type-specific initial values
    if (type === 'categorize') {
      newQuestion.categories = [];
      newQuestion.items = [];
    } else if (type === 'cloze') {
      newQuestion.clozeText = '';
      newQuestion.blanks = [];
    } else if (type === 'comprehension') {
      newQuestion.passage = '';
      newQuestion.mcqs = [];
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const updateQuestion = (id, updates) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => 
        q.id === id ? {...q, ...updates} : q
      )
    });
  };

  const removeQuestion = (id) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== id)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { data } = await axios.post('/api/forms', formData);
      navigate(`/forms/${data._id}/edit`, { 
        state: { success: 'Form created successfully!' } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create form. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Form</h1>
      
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">Form Header Image</label>
          {formData.headerImage ? (
            <div className="relative">
              <img 
                src={formData.headerImage} 
                alt="Header preview" 
                className="w-full h-48 object-contain rounded border"
              />
              <button
                type="button"
                onClick={() => setFormData({...formData, headerImage: ''})}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
              <PhotoIcon className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-600">Upload header image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Form Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <FieldEditor
          questions={formData.questions}
          addQuestion={addQuestion}
          updateQuestion={updateQuestion}
          removeQuestion={removeQuestion}
        />

        {error && <div className="text-red-500 mb-4 p-4 bg-red-50 rounded">{error}</div>}

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Form'}
          </button>
        </div>
      </form>
    </div>
  );
}