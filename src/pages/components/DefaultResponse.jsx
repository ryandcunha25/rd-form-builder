// src/components/DefaultResponse.js
import React from 'react';

export default function DefaultResponse({ question, value, onChange }) {
  switch (question.type) {
    case 'text':
      return (
        <div className="relative">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder={question.placeholder}
            required={question.required}
          />
        </div>
      );
    case 'dropdown':
      return (
        <div className="relative">
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      );
    case 'checkbox':
      return (
        <label className="flex items-center gap-3 group cursor-pointer">
          <div className={`flex items-center justify-center w-6 h-6 border-2 rounded-md transition-colors ${
            value ? 'bg-blue-500 border-blue-500' : 'border-gray-300 group-hover:border-blue-400'
          }`}>
            {value && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="hidden"
            required={question.required}
          />
          <span className="text-gray-700">{question.label || "Check if applicable"}</span>
        </label>
      );
    default:
      return null;
  }
}