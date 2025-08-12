import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FieldEditor from './components/FieldEditor';
import { PhotoIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import FormPreview from './components/FormPreview';
import { TrashIcon } from '@heroicons/react/24/solid';

export default function EditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    headerImage: '',
    questions: []
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/${id}`);
        setFormData(data);
      } catch (err) {
        setError('Failed to load form. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({...formData, headerImage: event.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuestionImageUpload = (questionId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateQuestion(questionId, { image: event.target.result });
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
      points: 1,
      image: ''
    };

    if (type === 'categorize') {
      newQuestion.categories = ['Category 1'];
      newQuestion.items = [{ id: Date.now().toString(), text: 'Item 1', category: 'Category 1' }];
    } else if (type === 'cloze') {
      newQuestion.clozeText = '';
      newQuestion.blanks = [];
    } else if (type === 'comprehension') {
      newQuestion.passage = '';
      newQuestion.mcqs = [{
        id: Date.now().toString(),
        question: '',
        options: ['Option 1', 'Option 2', 'Option 3'],
        correctAnswer: 0
      }];
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
      await axios.put(`http://localhost:5000/${id}/edit`, formData);
      navigate('/dashboard', { state: { success: 'Form updated successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update form. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const questions = [...formData.questions];
    const [draggedItem] = questions.splice(dragIndex, 1);
    questions.splice(dropIndex, 0, draggedItem);
    setFormData({ ...formData, questions });
  };

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
        {previewMode ? 'Previewing: ' : 'Editing: '}{formData.title}
        </h1>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {previewMode ? (
            <>
              <PencilIcon className="h-5 w-5" />
              Switch to Edit
            </>
          ) : (
            <>
              <EyeIcon className="h-5 w-5" />
              Preview Form
            </>
          )}
        </button>
      </div>

      {previewMode ? (
        <FormPreview form={formData} />
      ) : (
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

          <div className="mb-6 bg-white p-6 rounded-lg shadow">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="space-y-6 mb-6">
            {formData.questions.map((question, index) => (
              <div
                key={question.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="relative"
              >
                <FieldEditor
                  question={question}
                  handleQuestionImageUpload={handleQuestionImageUpload}
                  updateQuestion={updateQuestion}
                  removeQuestion={removeQuestion}
                />
              </div>
            ))}
          </div>

          <div className="mb-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Question</h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => addQuestion('categorize')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Categorize Question
              </button>
              <button
                type="button"
                onClick={() => addQuestion('cloze')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Cloze Question
              </button>
              <button
                type="button"
                onClick={() => addQuestion('comprehension')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Comprehension
              </button>
            </div>
          </div>

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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}