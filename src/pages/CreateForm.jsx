import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormEditor from './components/FormEditor';
import FormPreview from './components/FormPreview';

export default function CreateForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        headerImage: '',
        questions: [],
        collectRespondentInfo: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';


    const handleImageUpload = (e, questionId = null) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            if (questionId) {
                updateQuestion(questionId, { image: event.target.result });
            } else {
                setFormData((prev) => ({ ...prev, headerImage: event.target.result }));
            }
        };
        reader.readAsDataURL(file);
    };

    const addQuestion = (type) => {
        const id = Date.now().toString();
        const newQuestion = {
            id,
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
            newQuestion.passage = 'Enter the passage here...';
            newQuestion.mcqs = [
                {
                    id: Date.now().toString(),
                    question: 'What is the main idea?',
                    options: ['Option 1', 'Option 2', 'Option 3'],
                    correctAnswer: 0
                }
            ];
        }
        setFormData((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion]
        }));
    };

    const handleQuestionImageUpload = (questionId, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            updateQuestion(questionId, { image: event.target.result });
        };
        reader.readAsDataURL(file);
    };

    const updateQuestion = (id, updates) => {
        setFormData((prev) => ({
            ...prev,
            questions: prev.questions.map(q =>
                q.id === id ? { ...q, ...updates } : q
            )
        }));
    };

    const removeQuestion = (id) => {
        setFormData((prev) => ({
            ...prev,
            questions: prev.questions.filter(q => q.id !== id)
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            console.log(formData);
            const { data } = await axios.post(`${backendUrl}/createForm`, formData);
            
            console.log('Form created successfully:', data);
            navigate('/', {
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

            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
                <FormEditor
                    formData={formData}
                    setFormData={setFormData}
                    handleImageUpload={handleImageUpload}
                    addQuestion={addQuestion}
                    handleQuestionImageUpload={handleQuestionImageUpload}
                    updateQuestion={updateQuestion}
                    removeQuestion={removeQuestion}
                />

                <div className="mt-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.collectRespondentInfo}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    collectRespondentInfo: e.target.checked
                                }))
                            }
                        />
                        <span className="text-gray-700">
                            Collect respondent's name and email
                        </span>
                    </label>
                </div>

                {/* Pass all question details to FormPreview */}
                <FormPreview 
                    formData={formData} 
                    questions={formData.questions} 
                />

                {error && (
                    <div className="text-red-500 mb-4 p-4 bg-red-50 rounded">
                        {error}
                    </div>
                )}

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
