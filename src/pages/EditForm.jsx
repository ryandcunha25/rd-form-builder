import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FieldEditor from './components/FieldEditor';
import { PhotoIcon, EyeIcon, PencilIcon, CheckIcon, XMarkIcon, SparklesIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import FormPreview from './components/FormPreview';
import { TrashIcon } from '@heroicons/react/24/solid';

export default function EditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    headerImage: '',
    questions: [],
    acceptingResponses: true
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isTogglingAcceptance, setIsTogglingAcceptance] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/${id}`);
       const transformedData = {
        ...data,
        questions: data.questions.map(question => ({
          ...question,
          id: question.questionId // Use questionId as id
        }))
      };
      setFormData(transformedData);
      } catch (err) {
        setError('Failed to load form. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const toggleAcceptingResponses = async () => {
    setIsTogglingAcceptance(true);
    try {
      const { data } = await axios.put(`http://localhost:5000/${id}/toggle-accepting`);
      setFormData(prev => ({ ...prev, acceptingResponses: data.acceptingResponses }));
    } catch (err) {
      setError('Failed to update form status. Please try again.');
      console.error('Toggle accepting responses error:', err);
    } finally {
      setIsTogglingAcceptance(false);
    }
  };

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
        questionId: Date.now().toString(), // Add this line

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
    console.log('Removing question with id:', id);
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q._id !== id)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await axios.put(`http://localhost:5000/${id}/edit`, formData);
      navigate('/', { state: { success: 'Form updated successfully!' } });
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

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
          <div className="absolute inset-3 animate-spin rounded-full border-4 border-transparent bg-gradient-to-r from-purple-500 to-blue-600 rounded-full"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading your form...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <DocumentPlusIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {previewMode ? 'Previewing' : 'Editing'}
                </h1>
                <p className="text-lg text-gray-600 font-medium">{formData.title || 'Untitled Form'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Status Toggle */}
              <button
                onClick={toggleAcceptingResponses}
                disabled={isTogglingAcceptance}
                className={`relative inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  formData.acceptingResponses 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                    : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                } ${isTogglingAcceptance ? 'opacity-70 scale-95' : ''}`}
              >
                {isTogglingAcceptance ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {formData.acceptingResponses ? (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        Accepting Responses
                      </>
                    ) : (
                      <>
                        <XMarkIcon className="h-4 w-4" />
                        Not Accepting
                      </>
                    )}
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Status Warning */}
        {!formData.acceptingResponses && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XMarkIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">Form Not Accepting Responses</h3>
                <p className="text-red-700 mt-1">
                  Your form is currently closed to new submissions. Toggle the status button above to start accepting responses again.
                </p>
              </div>
            </div>
          </div>
        )}

        {previewMode ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <FormPreview form={formData} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
            {/* Header Image Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <PhotoIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Header Image</h3>
              </div>
              
              {formData.headerImage ? (
                <div className="relative group">
                  <img 
                    src={formData.headerImage} 
                    alt="Header preview" 
                    className="w-full h-56 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-xl flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, headerImage: ''})}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group">
                  <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <PhotoIcon className="h-8 w-8 text-white" />
                  </div>
                  <span className="mt-3 text-lg font-semibold text-gray-700 group-hover:text-indigo-600">Upload header image</span>
                  <span className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Form Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Title */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <label htmlFor="title" className="block text-lg font-bold text-gray-900 mb-3">
                  Form Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-20 focus:border-indigo-500 transition-all duration-200 text-lg"
                  placeholder="Enter your form title..."
                  required
                />
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <label htmlFor="description" className="block text-lg font-bold text-gray-900 mb-3">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-20 focus:border-indigo-500 transition-all duration-200 text-lg resize-none"
                  rows={4}
                  placeholder="Describe your form (optional)..."
                />
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-6">
              {console.log('Rendering questions:', formData.questions)}
              {formData.questions.map((question, index) => (
                <div
                  key={question._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="relative transform transition-all duration-200 hover:scale-[1.01] hover:shadow-2xl"
                >
                  <FieldEditor
                    question={question}
                    handleQuestionImageUpload={handleQuestionImageUpload}
                    updateQuestion={updateQuestion}
                    removeQuestion={() => removeQuestion(question._id)}
                  />
                </div>
              ))}
            </div>

            {/* Add Question Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Add New Question</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {[
                  // { type: 'text', label: 'Text', gradient: 'from-blue-500 to-cyan-500' },
                  // { type: 'multiple-choice', label: 'Multiple Choice', gradient: 'from-purple-500 to-pink-500' },
                  // { type: 'checkbox', label: 'Checkbox', gradient: 'from-green-500 to-emerald-500' },
                  { type: 'categorize', label: 'Categorize', gradient: 'from-orange-500 to-red-500' },
                  { type: 'cloze', label: 'Cloze', gradient: 'from-indigo-500 to-purple-500' },
                  { type: 'comprehension', label: 'Comprehension', gradient: 'from-teal-500 to-cyan-500' }
                ].map(({ type, label, gradient }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addQuestion(type)}
                    className={`px-4 py-3 bg-gradient-to-r ${gradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 text-lg`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XMarkIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="ml-3 text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}