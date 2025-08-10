// src/components/SidebarNavigation.js
import React from 'react';

export default function SidebarNavigation({ 
  isOpen, 
  progress, 
  answeredCount, 
  totalQuestions, 
  questions, 
  questionStatus, 
  scrollToQuestion 
}) {
  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Form Navigation</h2>
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Progress: {progress}%</span>
            <span className="text-sm font-medium text-gray-700">{answeredCount}/{totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <ul className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {questions.map((question, index) => (
            <li key={question.id}>
              <button
                onClick={() => scrollToQuestion(question.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center ${
                  questionStatus[question.id]?.marked 
                    ? 'bg-yellow-100 border-l-4 border-yellow-500' 
                    : questionStatus[question.id]?.answered 
                      ? 'bg-green-50 border-l-4 border-green-500' 
                      : 'bg-gray-100 hover:bg-gray-200 border-l-4 border-gray-300'
                }`}
              >
                <span className="mr-2 font-medium">Q{index + 1}</span>
                <span className="truncate">{question.questionText.substring(0, 30)}{question.questionText.length > 30 ? '...' : ''}</span>
                {questionStatus[question.id]?.marked && (
                  <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Review</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}