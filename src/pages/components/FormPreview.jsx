// src/components/FormPreview.js
import { useState } from 'react';
import {
  PuzzlePieceIcon,
  DocumentTextIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const FormPreview = ({ form }) => {
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize responses based on question types
  const initializeResponses = () => {
    const initialResponses = {};
    form.questions.forEach(question => {
      if (question.type === 'categorize') {
        initialResponses[question.id] = question.items.map(item => ({
          itemId: item.id,
          category: ''
        }));
      } else if (question.type === 'cloze') {
        initialResponses[question.id] = Array(question.blanks.length).fill('');
      } else if (question.type === 'comprehension') {
        initialResponses[question.id] = Array(question.mcqs.length).fill('');
      } else {
        initialResponses[question.id] = '';
      }
    });
    setResponses(initialResponses);
  };

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // In a real app, you would submit to your backend here
    console.log('Form responses:', responses);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Form submitted successfully! (Check console for responses)');
    }, 1000);
  };

  const renderQuestionTypeBadge = (type) => {
    switch (type) {
      case 'categorize':
        return (
          <span className="flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
            <PuzzlePieceIcon className="h-3 w-3 mr-1" /> Categorize
          </span>
        );
      case 'cloze':
        return (
          <span className="flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            <DocumentTextIcon className="h-3 w-3 mr-1" /> Cloze
          </span>
        );
      case 'comprehension':
        return (
          <span className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            <BookOpenIcon className="h-3 w-3 mr-1" /> Comprehension
          </span>
        );
      default:
        return null;
    }
  };

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'categorize':
        return (
          <CategorizeResponse 
            question={question}
            value={responses[question.id] || []}
            onChange={(val) => handleResponseChange(question.id, val)}
          />
        );
      case 'cloze':
        return (
          <ClozeResponse
            question={question}
            value={responses[question.id] || []}
            onChange={(val) => handleResponseChange(question.id, val)}
          />
        );
      case 'comprehension':
        return (
          <ComprehensionResponse
            question={question}
            value={responses[question.id] || []}
            onChange={(val) => handleResponseChange(question.id, val)}
          />
        );
      default:
        return (
          <DefaultResponse
            question={question}
            value={responses[question.id] || ''}
            onChange={(val) => handleResponseChange(question.id, val)}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {form.headerImage && (
        <div className="h-48 w-full overflow-hidden">
          <img 
            src={form.headerImage} 
            alt="Form header" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-600 mb-6">{form.description}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {form.questions.map((question, index) => (
            <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                  {index + 1}. {question.questionText}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                {renderQuestionTypeBadge(question.type)}
              </div>

              {question.questionImage && (
                <div className="mb-4">
                  <img 
                    src={question.questionImage} 
                    alt="Question" 
                    className="max-w-full max-h-60 rounded"
                  />
                </div>
              )}

              {question.points > 0 && (
                <p className="text-sm text-gray-500 mb-3">{question.points} point(s)</p>
              )}

              {renderQuestion(question, index)}
            </div>
          ))}

          {error && (
            <div className="text-red-500 p-4 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Response Components
const CategorizeResponse = ({ question, value, onChange }) => {
  const handleCategoryChange = (itemId, category) => {
    const updated = value.map(item => 
      item.itemId === itemId ? {...item, category} : item
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Categories</h4>
          <div className="space-y-2">
            {question.categories.map(category => (
              <div key={category} className="p-2 bg-gray-100 rounded">
                {category}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Items</h4>
          <div className="space-y-2">
            {question.items.map(item => {
              const responseItem = value.find(i => i.itemId === item.id) || {};
              return (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="flex-1">{item.text}</span>
                  <select
                    value={responseItem.category || ''}
                    onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                    className="px-2 py-1 border rounded"
                    required={question.required}
                  >
                    <option value="">Select</option>
                    {question.categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClozeResponse = ({ question, value, onChange }) => {
  const handleBlankChange = (index, answer) => {
    const updated = [...value];
    updated[index] = answer;
    onChange(updated);
  };

  const parts = question.clozeText.split(/(______)/g);
  let blankIndex = 0;

  return (
    <div className="space-y-4">
      <div className="prose max-w-none">
        {parts.map((part, i) => (
          part === '______' ? (
            <span key={i} className="inline-flex mx-1">
              <input
                type="text"
                value={value[blankIndex] || ''}
                onChange={(e) => handleBlankChange(blankIndex++, e.target.value)}
                className="w-32 border-b-2 border-dashed border-blue-500 focus:outline-none px-1"
                placeholder={question.blanks[blankIndex]?.hint}
                required={question.required}
              />
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        ))}
      </div>
    </div>
  );
};

const ComprehensionResponse = ({ question, value, onChange }) => {
  const handleMCQChange = (index, answer) => {
    const updated = [...value];
    updated[index] = answer;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none border-l-4 border-blue-200 pl-4 py-2 bg-blue-50">
        {question.passage}
      </div>

      <div className="space-y-4">
        {question.mcqs.map((mcq, index) => (
          <div key={index} className="space-y-2">
            <p className="font-medium">{index + 1}. {mcq.question}</p>
            <div className="space-y-2 pl-4">
              {mcq.options.map((option, optIndex) => (
                <label key={optIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`mcq-${index}`}
                    value={option}
                    checked={value[index] === option}
                    onChange={() => handleMCQChange(index, option)}
                    className="text-blue-600 focus:ring-blue-500"
                    required={question.required}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DefaultResponse = ({ question, value, onChange }) => {
  switch (question.type) {
    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder={question.placeholder}
          required={question.required}
        />
      );
    case 'dropdown':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          required={question.required}
        >
          <option value="">Select an option</option>
          {question.options.map((option, i) => (
            <option key={i} value={option}>{option}</option>
          ))}
        </select>
      );
    case 'checkbox':
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            required={question.required}
          />
          <span>Check if applicable</span>
        </label>
      );
    default:
      return null;
  }
};

export default FormPreview;