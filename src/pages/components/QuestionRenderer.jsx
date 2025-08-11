import React, { forwardRef } from 'react';
import CategorizeResponse from './CategorizeResponse';
import ClozeResponse from './ClozeResponse';
import ComprehensionResponse from './ComprehensionResponse';
import DefaultResponse from './DefaultResponse';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const QuestionRenderer = forwardRef(({ 
  question, 
  index, 
  value, 
  questionStatus, 
  onChange, 
  toggleMarkForReview 
}, ref) => {
  
  const questionId = question._id?.$oid || question._id || question.id;
  const questionImage = question.questionImage || question.image;
  const isRequired = question.required;
  const isAnswered = questionStatus?.answered;
  const isMarked = questionStatus?.marked;

  const renderQuestion = () => {
    switch (question.type) {
      case 'categorize':
        return (
          <CategorizeResponse 
            question={question}
            value={Array.isArray(value) ? value : []}
            onChange={onChange}
          />
        );
      case 'cloze':
        return (
          <ClozeResponse
            question={question}
            value={Array.isArray(value) ? value : Array(question.blanks?.length || 0).fill('')}
            onChange={onChange}
          />
        );
      case 'comprehension':
        return (
          <ComprehensionResponse
            question={question}
            value={Array.isArray(value) ? value : Array(question.mcqs?.length || 0).fill('')}
            onChange={onChange}
          />
        );
      default:
        return (
          <DefaultResponse
            question={question}
            value={value || ''}
            onChange={onChange}
          />
        );
    }
  };

  return (
    <div 
      id={`question-${questionId}`}
      ref={el => ref.current[questionId] = el}
      className={`p-6 rounded-xl transition-all ${
        isMarked 
          ? 'bg-yellow-50 border-2 border-yellow-200' 
          : 'bg-gray-50 border border-gray-100'
      } ${
        isRequired && !isAnswered ? 'border-l-4 border-l-red-500' : ''
      }`}
    >
      {questionImage && (
        <div className="mb-5">
          <img 
            src={questionImage} 
            alt="Question" 
            className="w-full max-h-80 object-contain rounded-lg"
          />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-800">
              {index + 1}. {question.questionText || 'Complete the sentence below:'}
            </h3>
            
            {/* Required/Optional badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isRequired 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {isRequired ? (
                <>
                  <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                  Required
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Optional
                </>
              )}
            </span>
          </div>
          
          {/* Warning for unanswered required questions */}
          {isRequired && !isAnswered && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <ExclamationCircleIcon className="h-4 w-4 mr-1" />
              This question is required
            </p>
          )}
          
          {question.points > 0 && (
            <span className="text-sm text-gray-500">{question.points} point(s)</span>
          )}
        </div>
        
        <button
          type="button"
          onClick={toggleMarkForReview}
          className={`p-2 rounded-full ${
            isMarked 
              ? 'bg-yellow-100 text-yellow-600' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          title={isMarked ? "Unmark for review" : "Mark for review"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {renderQuestion()}
    </div>
  );
});

export default QuestionRenderer;