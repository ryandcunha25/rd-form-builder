// src/components/ViewForm.js
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarNavigation from './components/SidebarNavigation';
import FormHeader from './components/FormHeader';
import QuestionRenderer from './components/QuestionRenderer';

export default function ViewForm() {
 const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);
  const [questionStatus, setQuestionStatus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Add state for share modal and link
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const questionRefs = useRef({});

  // Generate the shareable link
  const shareableLink = `${window.location.origin}/forms/${id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/${id}`);
        setForm(data);

        // Initialize responses and status with better type safety
        const initialResponses = {};
        const initialStatus = {};

        data.questions.forEach(question => {
          // Get consistent question ID (support different ID formats)
          const questionId = question._id?.$oid || question._id || question.id;

          initialStatus[questionId] = {
            answered: false,
            marked: false
          };

          console.log('Initializing question:', questionId, 'Type:', question.type, question);

          // Initialize responses based on question type with proper structure
          switch (question.type) {
            case 'categorize':
              initialResponses[questionId] = question.items?.map(item => ({
                itemId: item.id,
                category: item.category || ''
              })) || [];
              break;

            case 'cloze':
              // Initialize with empty strings for each blank
              const blankCount = question.blanks?.length || 0;
              initialResponses[questionId] = Array(blankCount).fill('');
              console.log(`Initialized cloze question ${questionId} with ${blankCount} blanks`);
              break;

            case 'comprehension':
              // Initialize with empty strings for each MCQ
              const mcqCount = question.mcqs?.length || 0;
              initialResponses[questionId] = Array(mcqCount).fill('');
              console.log(`Initialized comprehension question ${questionId} with ${mcqCount} MCQs`);
              break;

            case 'checkbox':
              initialResponses[questionId] = false;
              break;

            case 'multiple-choice':
            case 'radio':
              initialResponses[questionId] = '';
              break;

            default:
              // For text, textarea, and other simple types
              initialResponses[questionId] = '';
              break;
          }
        });

        console.log('Initial responses structured:', initialResponses);
        setResponses(initialResponses);
        setQuestionStatus(initialStatus);
      } catch (err) {
        setError('Failed to load form. Please try again.');
        console.error('Form fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleResponseChange = (questionId, value) => {
    console.log('Response changing for question:', questionId, 'New value:', value, 'Type:', typeof value, 'Is Array:', Array.isArray(value));

    // Update responses with proper state management
    setResponses(prevResponses => {
      const updated = {
        ...prevResponses,
        [questionId]: value
      };
      console.log('Updated responses state:', updated);
      return updated;
    });

    // Update question answered status
    setQuestionStatus(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answered: isQuestionAnswered(questionId, value)
      }
    }));
  };

  const isQuestionAnswered = (questionId, value) => {
    const question = form?.questions?.find(q => {
      const qId = q._id?.$oid || q._id || q.id;
      return qId === questionId;
    });

    if (!question) {
      console.log('Question not found for ID:', questionId);
      return false;
    }

    console.log('Checking if answered - Question:', questionId, 'Type:', question.type, 'Value:', value);

    switch (question.type) {
      case 'categorize':
        return Array.isArray(value) && value.length > 0 && value.every(item => item.category !== '');

      case 'cloze':
        return Array.isArray(value) && value.length > 0 && value.every(blank => blank && blank.trim() !== '');

      case 'comprehension':
        return Array.isArray(value) && value.length > 0 && value.every(answer => answer !== '' && answer != null);

      case 'checkbox':
        return value === true;

      case 'multiple-choice':
      case 'radio':
        return value !== '' && value != null;

      default:
        return value !== '' && value != null && value !== undefined;
    }
  };

  const toggleMarkForReview = (questionId) => {
    console.log('Toggling mark for review for question:', questionId);
    setQuestionStatus(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        marked: !prev[questionId]?.marked
      }
    }));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      console.log('Saving draft with responses:', responses);
      await axios.post(`/api/forms/${id}/drafts`, { responses });
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    } catch (err) {
      setError('Failed to save draft. Please try again.');
      console.error('Save draft error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // if (isLoading) return (
  //   <div className="flex justify-center items-center h-screen">
  //     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  //   </div>
  // );

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError('');

  try {
    console.log('Submitting responses:', responses);
    
    // Validate that we have responses for required questions
    const unansweredRequired = form.questions.filter(question => {
      const questionId = question._id?.$oid || question._id || question.id;
      return question.required && !isQuestionAnswered(questionId, responses[questionId]);
    });

    if (unansweredRequired.length > 0) {
      setError(`Please answer all required questions: ${unansweredRequired.map(q => `Question ${form.questions.indexOf(q) + 1}`).join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    // Calculate total points
    let totalPoints = 0;
    let maxPossiblePoints = 0;

    form.questions.forEach(question => {
      const questionId = question._id?.$oid || question._id || question.id;
      const questionPoints = question.points || 1; // Default to 1 point if not specified
      maxPossiblePoints += questionPoints;
      
      const userAnswer = responses[questionId];
      console.log(`Checking answer for question ${questionId} (type: ${question.type})`, {
        userAnswer,
        correctAnswer: question.correctAnswer
      });

      if (!userAnswer) {
        return; // Skip if no answer provided
      }

      switch (question.type) {
        case 'categorize':
          // Check if all items are categorized correctly
          if (Array.isArray(userAnswer) && question.items) {
            const allCorrect = question.items.every(item => {
              const userResponse = userAnswer.find(res => res.itemId === item.id);
              return userResponse && userResponse.category === item.category;
            });
            if (allCorrect) {
              totalPoints += questionPoints;
            }
          }
          break;

        case 'cloze':
          // Check if all blanks are filled correctly
          if (Array.isArray(userAnswer) && question.blanks) {
            const allCorrect = question.blanks.every((blank, index) => {
              return userAnswer[index] === blank.word;
            });
            if (allCorrect) {
              totalPoints += questionPoints;
            }
          }
          break;

        case 'comprehension':
          // Check each MCQ answer
          if (Array.isArray(userAnswer) && question.mcqs) {
            const allCorrect = question.mcqs.every((mcq, index) => {
              return userAnswer[index] === mcq.options[mcq.correctAnswer];
            });
            if (allCorrect) {
              totalPoints += questionPoints;
            }
          }
          break;

        case 'checkbox':
        case 'multiple-choice':
        case 'radio':
          // For simple single-answer questions
          if (question.correctAnswer !== undefined && 
              JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)) {
            totalPoints += questionPoints;
          }
          break;

        default:
          // For text answers, we can't auto-score unless there's a correctAnswer
          if (question.correctAnswer !== undefined && 
              userAnswer.toString().toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim()) {
            totalPoints += questionPoints;
          }
          break;
      }
    });

    console.log('Calculated score:', {
      totalPoints,
      maxPossiblePoints
    });

    const response = await axios.post(`http://localhost:5000/forms/${id}/submission`, {
      responses,
      score: totalPoints,
      maxScore: maxPossiblePoints
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Submission response:', response.data);
    navigate('/confirmation', {
      state: {
        success: 'Form submitted successfully!',
        answeredCount: Object.values(questionStatus).filter(s => s.answered).length,
        totalQuestions: form.questions.length,
        score: totalPoints,
        maxScore: maxPossiblePoints,
        percentage: Math.round((totalPoints / maxPossiblePoints) * 100)
      }
    });
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
    console.error('Submit error:', err);
  } finally {
    setIsSubmitting(false);
  }
};

  const scrollToQuestion = (questionId) => {
    const element = questionRefs.current[questionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-blue-500', 'animate-pulse');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-500', 'animate-pulse');
      }, 2000);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );

  if (!form) return <div className="text-center py-12 text-xl">{error || 'Form not found.'}</div>;

  // Calculate progress
  const answeredCount = Object.values(questionStatus).filter(s => s.answered).length;
  const totalQuestions = form.questions.length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  return (
        <div className="flex min-h-screen bg-gray-50">

    {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Share this form</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Anyone with this link can fill out the form:</p>
              <div className="flex">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 ${isCopied ? 'bg-green-600' : 'bg-blue-600'} text-white rounded-r-md hover:${isCopied ? 'bg-green-700' : 'bg-blue-700'} transition-colors min-w-[80px]`}
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
           
          </div>
        </div>
      )}

     <SidebarNavigation
        isOpen={isSidebarOpen}
        progress={progress}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        questions={form.questions}
        questionStatus={questionStatus}
        scrollToQuestion={scrollToQuestion}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          {/* Mobile Navigation Toggle */}
           <div className="lg:hidden fixed top-4 left-4 z-20">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-white rounded-lg shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
             <FormHeader
              headerImage={form.headerImage}
              title={form.title}
              description={form.description}
              progress={progress}
              onShare={() => setShowShareModal(true)}
            />

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-10">
                {form.questions.map((question, index) => {
                  const questionId = question._id?.$oid || question._id || question.id;

                  return (
                    <QuestionRenderer
                      key={questionId}
                      question={question}
                      index={index}
                      value={responses[questionId]}
                      questionStatus={{
                        ...questionStatus[questionId],
                        // Add a flag for required but unanswered
                        requiredUnanswered: question.required && !questionStatus[questionId]?.answered
                      }} ref={questionRefs}

                      onChange={(val) => handleResponseChange(questionId, val)}
                      toggleMarkForReview={() => toggleMarkForReview(questionId)}
                    />
                  );
                })}

                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Draft'}
                  </button>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {draftSaved && (
                      <div className="flex items-center px-4 py-3 bg-green-50 text-green-700 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Draft saved!
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : 'Submit Form'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel - Remove in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs max-w-sm max-h-32 overflow-auto">
          <details>
            <summary className="cursor-pointer">Debug Info</summary>
            <div className="mt-2 space-y-1">
              <div>Progress: {answeredCount}/{totalQuestions}</div>
              <div>Responses: {JSON.stringify(Object.keys(responses))}</div>
              <div>Question Types: {form?.questions?.map(q => q.type).join(', ')}</div>
            </div>
          </details>
        </div>
      )} */}
    </div>
  );
}