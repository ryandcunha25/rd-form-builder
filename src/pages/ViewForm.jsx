import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarNavigation from './components/SidebarNavigation';
import FormHeader from './components/FormHeader';
import QuestionRenderer from './components/QuestionRenderer';
import { CheckCircleIcon, XMarkIcon, ClipboardDocumentIcon, ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const questionRefs = useRef({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

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

        const initialResponses = {};
        const initialStatus = {};

        data.questions.forEach(question => {
          const questionId = question._id?.$oid || question._id || question.id;

          initialStatus[questionId] = {
            answered: false,
            marked: false
          };

          switch (question.type) {
            case 'categorize':
              initialResponses[questionId] = question.items?.map(item => ({
                itemId: item.id,
                category: item.category || ''
              })) || [];
              break;
            case 'cloze':
              const blankCount = question.blanks?.length || 0;
              initialResponses[questionId] = Array(blankCount).fill('');
              break;
            case 'comprehension':
              const mcqCount = question.mcqs?.length || 0;
              initialResponses[questionId] = Array(mcqCount).fill('');
              break;
            case 'checkbox':
              initialResponses[questionId] = false;
              break;
            case 'multiple-choice':
            case 'radio':
              initialResponses[questionId] = '';
              break;
            default:
              initialResponses[questionId] = '';
              break;
          }
        });

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
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: value
    }));

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

    if (!question) return false;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const unansweredRequired = form.questions.filter(question => {
        const questionId = question._id?.$oid || question._id || question.id;
        return question.required && !isQuestionAnswered(questionId, responses[questionId]);
      });

      if (unansweredRequired.length > 0) {
        setError(`Please answer all required questions: ${unansweredRequired.map(q => `Question ${form.questions.indexOf(q) + 1}`).join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      let totalPoints = 0;
      let maxPossiblePoints = 0;

      form.questions.forEach(question => {
        const questionId = question._id?.$oid || question._id || question.id;
        const questionPoints = question.points || 1;
        maxPossiblePoints += questionPoints;

        const userAnswer = responses[questionId];
        if (!userAnswer) return;

        switch (question.type) {
          case 'categorize':
            if (Array.isArray(userAnswer) && question.items) {
              const allCorrect = question.items.every(item => {
                const userResponse = userAnswer.find(res => res.itemId === item.id);
                return userResponse && userResponse.category === item.category;
              });
              if (allCorrect) totalPoints += questionPoints;
            }
            break;
          case 'cloze':
            if (Array.isArray(userAnswer) && question.blanks) {
              const allCorrect = question.blanks.every((blank, index) => {
                return userAnswer[index] === blank.word;
              });
              if (allCorrect) totalPoints += questionPoints;
            }
            break;
          case 'comprehension':
            if (Array.isArray(userAnswer) && question.mcqs) {
              const allCorrect = question.mcqs.every((mcq, index) => {
                return userAnswer[index] === mcq.options[mcq.correctAnswer];
              });
              if (allCorrect) totalPoints += questionPoints;
            }
            break;
          case 'checkbox':
          case 'multiple-choice':
          case 'radio':
            if (question.correctAnswer !== undefined &&
              JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)) {
              totalPoints += questionPoints;
            }
            break;
          default:
            if (question.correctAnswer !== undefined &&
              userAnswer.toString().toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim()) {
              totalPoints += questionPoints;
            }
            break;
        }
      });

      if (form.collectRespondentInfo && (!name.trim() || !email.trim())) {
        setError('Please provide your name and email');
        setIsSubmitting(false);
        return;
      }

      if (form.collectRespondentInfo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please provide a valid email address');
        setIsSubmitting(false);
        return;
      }

      await axios.post(`http://localhost:5000/forms/${id}/submission`, {
        responses,
        score: totalPoints,
        maxScore: maxPossiblePoints,
        respondentName: name,
        respondentEmail: email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

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
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading your form...</p>
      </div>
    </div>
  );

  if (!form) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="bg-red-100 p-3 rounded-full inline-flex mb-4">
          <XMarkIcon className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{error || 'Form not found'}</h3>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );

  const answeredCount = Object.values(questionStatus).filter(s => s.answered).length;
  const totalQuestions = form.questions.length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Share This Form</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Share this link with others to collect responses:</p>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm truncate"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-3 ${isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-r-lg transition-colors flex items-center`}
                  >
                    {isCopied ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <SidebarNavigation
        isOpen={isSidebarOpen}
        progress={progress}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        questions={form.questions}
        questionStatus={questionStatus}
        scrollToQuestion={scrollToQuestion}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-80' : ''}`}>
        {/* Mobile Navigation Toggle */}
        <div className={`lg:hidden fixed top-6 z-20 transition-all duration-300 ${isSidebarOpen ? 'left-[21rem]' : 'left-6'}`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-4 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 border border-gray-100 group"
          >
            <Bars3Icon className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto lg:mr-8">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <FormHeader
                headerImage={form.headerImage}
                title={form.title}
                description={form.description}
                progress={progress}
                onShare={() => setShowShareModal(true)}
              />

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-10">
                  {form.collectRespondentInfo && (
                    <div className="space-y-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <h3 className="text-lg font-semibold text-blue-800">Your Information</h3>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>
                  )}

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
                          requiredUnanswered: question.required && !questionStatus[questionId]?.answered
                        }}
                        ref={questionRefs}
                        onChange={(val) => handleResponseChange(questionId, val)}
                        toggleMarkForReview={() => toggleMarkForReview(questionId)}
                      />
                    );
                  })}

                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
                      <XMarkIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      <div>{error}</div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-gray-200">
                    {/* <button
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
                    </button> */}

                    <div className="flex flex-col sm:flex-row gap-4">
                      {draftSaved && (
                        <div className="flex items-center px-4 py-3 bg-green-50 text-green-700 rounded-lg">
                          <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                          Draft saved!
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 shadow-md"
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
      </div>
    </div>
  );
}