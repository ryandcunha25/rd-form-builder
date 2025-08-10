// src/components/ComprehensionResponse.js
import React from 'react';

export default function ComprehensionResponse({ question, value, onChange }) {
  const handleMCQChange = (index, answer) => {
    const updated = [...value];
    updated[index] = answer;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
        <p className="text-gray-700 text-lg">{question.passage}</p>
      </div>

      <div className="space-y-6">
        {question.mcqs.map((mcq, index) => (
          <div key={index} className="p-5 bg-white border border-gray-200 rounded-xl">
            <p className="font-medium text-lg mb-4">{index + 1}. {mcq.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mcq.options.map((option, optIndex) => (
                <label 
                  key={optIndex} 
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border-2 transition-all ${
                    value[index] === option 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`mcq-${index}`}
                    value={option}
                    checked={value[index] === option}
                    onChange={() => handleMCQChange(index, option)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    required={question.required}
                  />
                  <span className="flex-1">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}