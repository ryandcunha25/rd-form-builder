import { PhotoIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import CategorizeQuestion from './CategorizeQuestion';
import ClozeQuestion from './ClozeQuestion';

export default function FieldEditor({
    question,
    handleQuestionImageUpload,
    updateQuestion,
    removeQuestion
}) {
    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6 cursor-move hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">
                    {question.type === 'categorize' ? 'Categorize Question' :
                     question.type === 'cloze' ? 'Fill in the Blanks' : 'Comprehension'}
                </h3>
                <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                    <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) => updateQuestion(question.id, { questionText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        placeholder="Enter your question"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Image (Optional)</label>
                    {question.image ? (
                        <div className="relative mb-2">
                            <img
                                src={question.image}
                                alt="Question"
                                className="w-full h-32 object-contain rounded border"
                            />
                            <button
                                type="button"
                                onClick={() => updateQuestion(question.id, { image: '' })}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                            <span className="mt-1 text-xs text-gray-600">Upload image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleQuestionImageUpload(question.id, e)}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
                
                {question.type === 'categorize' && (
                    <CategorizeQuestion 
                        question={question} 
                        updateQuestion={updateQuestion} 
                    />
                )}
                
                {question.type === 'cloze' && (
                    <ClozeQuestion 
                        question={question} 
                        updateQuestion={updateQuestion} 
                    />
                )}
                
                {question.type === 'comprehension' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passage</label>
                            <textarea
                                value={question.passage}
                                onChange={(e) => updateQuestion(question.id, { passage: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                rows={5}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                            <div className="space-y-4">
                                {question.mcqs.map((mcq) => (
                                    <div key={mcq.id} className="border p-3 rounded">
                                        <div className="flex justify-between items-center mb-2">
                                            <input
                                                type="text"
                                                value={mcq.question}
                                                onChange={(e) => updateQuestion(question.id, {
                                                    mcqs: question.mcqs.map(m => 
                                                        m.id === mcq.id ? { ...m, question: e.target.value } : m
                                                    )
                                                })}
                                                className="flex-1 px-2 py-1 border-b font-medium"
                                                placeholder="Question text"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => updateQuestion(question.id, {
                                                    mcqs: question.mcqs.filter(m => m.id !== mcq.id)
                                                })}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="space-y-2 ml-4">
                                            {mcq.options.map((option, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={`mcq-${mcq.id}`}
                                                        checked={index === mcq.correctAnswer}
                                                        onChange={() => updateQuestion(question.id, {
                                                            mcqs: question.mcqs.map(m => 
                                                                m.id === mcq.id ? { ...m, correctAnswer: index } : m
                                                            )
                                                        })}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => {
                                                            const newOptions = [...mcq.options];
                                                            newOptions[index] = e.target.value;
                                                            updateQuestion(question.id, {
                                                                mcqs: question.mcqs.map(m => 
                                                                    m.id === mcq.id ? { ...m, options: newOptions } : m
                                                                )
                                                            });
                                                        }}
                                                        className="flex-1 px-2 py-1 border rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newOptions = mcq.options.filter((_, i) => i !== index);
                                                            const newCorrect = mcq.correctAnswer > index ? mcq.correctAnswer - 1 :
                                                                mcq.correctAnswer === index ? 0 : mcq.correctAnswer;
                                                            updateQuestion(question.id, {
                                                                mcqs: question.mcqs.map(m => 
                                                                    m.id === mcq.id ? {
                                                                        ...m,
                                                                        options: newOptions,
                                                                        correctAnswer: newCorrect
                                                                    } : m
                                                                )
                                                            });
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <XMarkIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newOptions = [...mcq.options, `Option ${mcq.options.length + 1}`];
                                                    updateQuestion(question.id, {
                                                        mcqs: question.mcqs.map(m => 
                                                            m.id === mcq.id ? { ...m, options: newOptions } : m
                                                        )
                                                    });
                                                }}
                                                className="flex items-center text-xs text-blue-600 hover:text-blue-800 ml-6"
                                            >
                                                Add Option
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => updateQuestion(question.id, {
                                        mcqs: [...question.mcqs, {
                                            id: Date.now().toString(),
                                            question: 'New question',
                                            options: ['Option 1', 'Option 2', 'Option 3'],
                                            correctAnswer: 0
                                        }]
                                    })}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Add Question
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id={`required-${question.id}`}
                            checked={question.required}
                            onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`required-${question.id}`} className="ml-2 block text-sm text-gray-700">
                            Required
                        </label>
                    </div>
                    <div className="flex items-center">
                        <label htmlFor={`points-${question.id}`} className="block text-sm text-gray-700 mr-2">
                            Points:
                        </label>
                        <input
                            type="number"
                            id={`points-${question.id}`}
                            value={question.points}
                            onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                            min="1"
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}