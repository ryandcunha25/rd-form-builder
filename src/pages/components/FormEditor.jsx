// EnhancedFormEditor.js
import React, { useState } from 'react';
import { DocumentPlusIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import CategorizeQuestion from './CategorizeQuestion';
import ClozeQuestion from './ClozeQuestion';

const questionTypes = [
  { value: 'text', label: 'Text Answer' },
  { value: 'categorize', label: 'Categorize' },
  { value: 'cloze', label: 'Cloze (Fill-in-the-blank)' },
  { value: 'comprehension', label: 'Comprehension' },
];

const FormEditor = ({ form, onChange }) => {
  const [headerImage, setHeaderImage] = useState(form.headerImage || '');
  const [questions, setQuestions] = useState(form.questions || []);

  const handleQuestionChange = (index, updatedQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
    onChange({ ...form, questions: updatedQuestions });
  };

  const addQuestion = (type) => {
    const newQuestion = {
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
    
    setQuestions([...questions, newQuestion]);
  };

  const uploadImage = async (file) => {
    // Implement actual image upload to Cloudinary or similar service
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // In a real app, you would upload to a service and get a URL
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleHeaderImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      setHeaderImage(imageUrl);
      onChange({ ...form, headerImage: imageUrl });
    }
  };

  const handleQuestionImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      const updatedQuestion = { ...questions[index], questionImage: imageUrl };
      handleQuestionChange(index, updatedQuestion);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">Form Header Image</label>
        {headerImage ? (
          <div className="relative">
            <img src={headerImage} alt="Header" className="w-full h-48 object-cover rounded" />
            <button
              onClick={() => {
                setHeaderImage('');
                onChange({ ...form, headerImage: '' });
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
            <PhotoIcon className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-600">Click to upload header image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleHeaderImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {questions.map((question, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, {
                  ...question,
                  questionText: e.target.value
                })}
                className="w-full text-lg font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Enter question text"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleQuestionImageChange(index, e)}
                  className="hidden"
                />
                <PhotoIcon className="h-5 w-5 text-gray-500" />
              </label>
              <button
                onClick={() => {
                  const updatedQuestions = questions.filter((_, i) => i !== index);
                  setQuestions(updatedQuestions);
                  onChange({ ...form, questions: updatedQuestions });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {question.questionImage && (
            <div className="relative mb-4">
              <img
                src={question.questionImage}
                alt="Question"
                className="max-w-full max-h-48 rounded"
              />
              <button
                onClick={() => handleQuestionChange(index, {
                  ...question,
                  questionImage: ''
                })}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-4">
            {question.type === 'categorize' && (
              <CategorizeQuestion
                question={question}
                onChange={(updatedQuestion) => handleQuestionChange(index, updatedQuestion)}
              />
            )}
            {question.type === 'cloze' && (
              <ClozeQuestion
                question={question}
                onChange={(updatedQuestion) => handleQuestionChange(index, updatedQuestion)}
              />
            )}
            {/* Similar implementations for other question types */}
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        {questionTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => addQuestion(type.value)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-md"
          >
            <DocumentPlusIcon className="h-4 w-4" />
            Add {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormEditor;