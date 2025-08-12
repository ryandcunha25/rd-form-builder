// src/components/SidebarNavigation.js
import React from 'react';

export default function SidebarNavigation({ 
  isOpen, 
  progress, 
  answeredCount, 
  totalQuestions, 
  questions, 
  questionStatus, 
  scrollToQuestion,
  onClose
}) {
  const getQuestionIcon = (question, status) => {
    if (status?.marked) {
      return (
        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else if (status?.answered) {
      return (
        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else if (question.required) {
      return (
        <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">{questions.indexOf(question) + 1}</span>
        </div>
      );
    }
  };

  const getQuestionTypeIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'multiple-choice':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
      case 'checkbox':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'text':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
      case 'categorize':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l2 2m0 0l-2 2m2-2H9m10 0V9a2 2 0 00-2-2M5 21l14-14m-7 7l-2-2m0 0l-2-2m2 2l2 2M5 21a2 2 0 002-2v-4a2 2 0 00-2-2H3a2 2 0 00-2 2v4a2 2 0 002 2h2z" /></svg>;
      case 'cloze':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>;
      case 'comprehension':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
      default:
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-20 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-80 bg-gradient-to-br from-white via-blue-50 to-indigo-50 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } border-r border-gray-200`}>
        
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Form Navigation</h2>
          </div>
          
          {/* Enhanced Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-blue-100">Overall Progress</span>
              <span className="text-lg font-bold">{progress}%</span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-white bg-opacity-20 rounded-full h-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-blue-100">
                <span className="font-semibold text-white">{answeredCount}</span> completed
              </span>
              <span className="text-blue-100">
                <span className="font-semibold text-white">{totalQuestions - answeredCount}</span> remaining
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="px-6 py-4 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-lg border border-green-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{answeredCount}</div>
              <div className="text-xs text-gray-600 font-medium">Completed</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-3 shadow-lg border border-yellow-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {Object.values(questionStatus).filter(s => s?.marked).length}
              </div>
              <div className="text-xs text-gray-600 font-medium">For Review</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-3 shadow-lg border border-red-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {questions.filter(q => q.required && !questionStatus[q._id?.$oid || q._id || q.id]?.answered).length}
              </div>
              <div className="text-xs text-gray-600 font-medium">Required</div>
            </div>
          </div>
        </div>
        
        {/* Questions List */}
        <div className="px-4 pb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3 px-2 uppercase tracking-wide">Questions</h3>
          <ul className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
            {questions.map((question, index) => {
              const questionId = question._id?.$oid || question._id || question.id;
              const status = questionStatus[questionId];
              
              return (
                <li key={questionId} className="group">
                  <button
                    onClick={() => scrollToQuestion(questionId)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-start gap-3 hover:shadow-lg transform hover:-translate-y-0.5 ${
                      status?.marked 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-md' 
                        : status?.answered 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-md' 
                          : question.required
                            ? 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 hover:border-red-300'
                            : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {/* Question Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getQuestionIcon(question, status)}
                    </div>
                    
                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">
                          Question {index + 1}
                        </span>
                        <div className="text-gray-400">
                          {getQuestionTypeIcon(question.type)}
                        </div>
                        {question.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                        {question.questionText || 'No question text'}
                      </p>
                      
                      {question.points && (
                        <div className="mt-2 text-xs text-gray-500 font-medium">
                          {question.points} point{question.points !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    
                    {/* Status Indicators */}
                    <div className="flex flex-col items-center gap-1">
                      {status?.marked && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                          Review
                        </span>
                      )}
                      {status?.answered && !status?.marked && (
                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                          Done
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">Ready to submit?</span>
              <div className="flex items-center gap-2">
                {progress === 100 ? (
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All Done!
                  </div>
                ) : (
                  <span className="text-gray-500 text-xs">
                    {totalQuestions - answeredCount} questions left
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}