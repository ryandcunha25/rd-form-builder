import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ViewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data } = await axios.get(`/api/forms/${id}`);
        setForm(data);
        
        // Initialize responses based on question types
        const initialResponses = {};
        data.questions.forEach(question => {
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
      } catch (err) {
        setError('Failed to load form. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await axios.post(`/api/forms/${id}/responses`, { responses });
      navigate('/', { state: { success: 'Form submitted successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'categorize':
        return (
          <CategorizeResponse 
            question={question}
            value={responses[question.id]}
            onChange={(val) => handleResponseChange(question.id, val)}
          />
        );
      case 'cloze':
        return (
          <ClozeResponse
            question={question}
            value={responses[question.id]}
            onChange={(val) => handleResponseChange(question.id, val)}
          />
        );
      case 'comprehension':
        return (
          <ComprehensionResponse
            question={question}
            value={responses[question.id]}
            onChange={(val) => handleResponseChange(question.id, val)}
          />
        );
      default:
        return (
          <DefaultResponse
            question={question}
            value={responses[question.id]}
            onChange={(val) => handleResponseChange(question.id, val)}
          />
        );
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!form) return <div className="text-center py-12">{error || 'Form not found.'}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
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
                {question.questionImage && (
                  <div className="mb-4">
                    <img 
                      src={question.questionImage} 
                      alt="Question" 
                      className="max-w-full max-h-60 rounded"
                    />
                  </div>
                )}
                
                <div className="mb-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    {index + 1}. {question.questionText}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  {question.points > 0 && (
                    <span className="text-sm text-gray-500">{question.points} point(s)</span>
                  )}
                </div>

                {renderQuestion(question)}
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
    </div>
  );
}

// Helper components would be defined here or imported
function CategorizeResponse({ question, value, onChange }) {
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
}

function ClozeResponse({ question, value, onChange }) {
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
}

function ComprehensionResponse({ question, value, onChange }) {
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
}

function DefaultResponse({ question, value, onChange }) {
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
}