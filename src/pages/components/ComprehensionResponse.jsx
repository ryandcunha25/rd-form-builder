// src/components/ComprehensionResponse.js
import React from 'react';

export default function ComprehensionResponse({ question, value = [], onChange }) {
    // Ensure we have a proper array for MCQ responses
    const ensuredValue = Array.isArray(value) ? value : [];
    
    const handleMCQChange = (index, answer) => {
        // Create a new array with the proper length
        const updated = [...ensuredValue];
        
        // Ensure the array is long enough for the current index
        while (updated.length <= index) {
            updated.push('');
        }
        
        // Update the specific MCQ answer
        updated[index] = answer;
        
        // Call onChange with the updated array
        onChange(updated);
    };

    // Safety check for question structure
    if (!question || !question.mcqs || !Array.isArray(question.mcqs)) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">Error: Invalid comprehension question structure</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Passage Section */}
            {question.passage && (
                <div className="prose max-w-none border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                    <p className="text-gray-700 text-lg leading-relaxed">{question.passage}</p>
                </div>
            )}

            {/* MCQ Questions Section */}
            <div className="space-y-6">
                {question.mcqs.map((mcq, index) => {
                    // Safety check for each MCQ
                    if (!mcq || !mcq.options || !Array.isArray(mcq.options)) {
                        return (
                            <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-600">Warning: Invalid MCQ structure at question {index + 1}</p>
                            </div>
                        );
                    }

                    return (
                        <div key={index} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <p className="font-medium text-lg mb-4 text-gray-800">
                                {index + 1}. {mcq.question || `Question ${index + 1}`}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mcq.options.map((option, optIndex) => {
                                    // Generate unique ID for each radio button
                                    const radioId = `mcq-${question.id || 'comp'}-${index}-${optIndex}`;
                                    const radioName = `mcq-${question.id || 'comp'}-${index}`;
                                    
                                    return (
                                        <label
                                            key={optIndex}
                                            htmlFor={radioId}
                                            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                                                ensuredValue[index] === option
                                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                            }`}
                                        >
                                            <input
                                                id={radioId}
                                                type="radio"
                                                name={radioName}
                                                value={option}
                                                checked={ensuredValue[index] === option}
                                                onChange={(e) => {
                                                    e.stopPropagation(); // Prevent event bubbling
                                                    handleMCQChange(index, option);
                                                }}
                                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
                                                required={question.required}
                                            />
                                            <span className="flex-1 text-gray-700 select-none">
                                                {option}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                            
                            {/* Show current selection for debugging */}
                            {process.env.NODE_ENV === 'development' && ensuredValue[index] && (
                                <div className="mt-3 text-sm text-green-600">
                                    Selected: {ensuredValue[index]}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <span>
                    Progress: {ensuredValue.filter(Boolean).length} of {question.mcqs.length} answered
                </span>
                <div className="flex gap-1">
                    {question.mcqs.map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                                ensuredValue[index] ? 'bg-green-400' : 'bg-gray-300'
                            }`}
                            title={`Question ${index + 1}: ${ensuredValue[index] ? 'Answered' : 'Not answered'}`}
                        />
                    ))}
                </div>
            </div>
            
            {/* Debug info (remove in production) */}
            {/* {process.env.NODE_ENV === 'development' && (
                <details className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                    <summary>Debug Information</summary>
                    <div className="mt-2 space-y-1">
                        <p>Question ID: {question.id || 'No ID'}</p>
                        <p>MCQs count: {question.mcqs?.length || 0}</p>
                        <p>Current values: {JSON.stringify(ensuredValue)}</p>
                        <p>Value type: {Array.isArray(value) ? 'Array' : typeof value}</p>
                    </div>
                </details>
            )} */}
        </div>
    );
}