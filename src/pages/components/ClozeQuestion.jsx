import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ClozeQuestion({ question, updateQuestion }) {
    const updateClozeText = (text) => {
        updateQuestion(question.id, { clozeText: text });
    };

    const toggleWordAsBlank = (wordIndex, word) => {
        const cleanWord = word.replace(/[^\w]/g, ''); // Remove punctuation for matching
        if (!cleanWord) return; // Skip empty words or punctuation-only

        // Check if this word is already a blank
        const existingBlank = question.blanks.find(blank => blank.wordIndex === wordIndex);
        
        if (existingBlank) {
            // Remove the blank
            removeBlank(existingBlank.id);
        } else {
            // Add new blank with minimal initial setup
            const newBlank = {
                id: Date.now().toString() + wordIndex,
                word: cleanWord,
                wordIndex: wordIndex,
                options: [''] // Start with just one empty option
            };
            
            updateQuestion(question.id, {
                blanks: [...question.blanks, newBlank]
            });
        }
    };

    const updateBlank = (blankId, updates) => {
        updateQuestion(question.id, {
            blanks: question.blanks.map(blank =>
                blank.id === blankId ? { ...blank, ...updates } : blank
            )
        });
    };

    const removeBlank = (blankId) => {
        updateQuestion(question.id, {
            blanks: question.blanks.filter(blank => blank.id !== blankId)
        });
    };

    const addOptionToBlank = (blankId) => {
        const blank = question.blanks.find(b => b.id === blankId);
        if (blank) {
            const newOptions = [...blank.options, ''];
            updateBlank(blankId, { options: newOptions });
        }
    };

    const removeOptionFromBlank = (blankId, optionIndex) => {
        const blank = question.blanks.find(b => b.id === blankId);
        if (blank && blank.options.length > 1) { // Keep at least 1 option
            const newOptions = blank.options.filter((_, index) => index !== optionIndex);
            updateBlank(blankId, { options: newOptions });
        }
    };

    const updateBlankOption = (blankId, optionIndex, value) => {
        const blank = question.blanks.find(b => b.id === blankId);
        if (blank) {
            const newOptions = [...blank.options];
            newOptions[optionIndex] = value;
            updateBlank(blankId, { options: newOptions });
        }
    };

    const setCorrectAnswer = (blankId, optionIndex) => {
        const blank = question.blanks.find(b => b.id === blankId);
        if (blank) {
            updateBlank(blankId, { correctAnswerIndex: optionIndex });
        }
    };

    const renderInteractiveText = () => {
        if (!question.clozeText) return null;

        const words = question.clozeText.split(' ');
        
        return (
            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-600 mb-3">
                    Click on any word below to turn it into a blank:
                </p>
                <div className="text-lg leading-relaxed">
                    {words.map((word, index) => {
                        const cleanWord = word.replace(/[^\w]/g, '');
                        const isBlank = question.blanks.some(blank => blank.wordIndex === index);
                        const punctuation = word.replace(/\w/g, ''); // Extract punctuation
                        
                        if (!cleanWord) {
                            // Handle spaces and punctuation-only segments
                            return <span key={index}>{word} </span>;
                        }

                        return (
                            <span key={index}>
                                <button
                                    type="button"
                                    onClick={() => toggleWordAsBlank(index, word)}
                                    className={`inline-block px-2 py-1 rounded transition-colors ${
                                        isBlank 
                                            ? 'bg-blue-500 text-white font-medium' 
                                            : 'hover:bg-blue-100 cursor-pointer'
                                    }`}
                                    title={isBlank ? 'Click to remove blank' : 'Click to make blank'}
                                >
                                    {isBlank ? '____' : cleanWord}
                                </button>
                                {punctuation && <span>{punctuation}</span>}
                                <span> </span>
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderPreview = () => {
        if (!question.clozeText) return null;

        const words = question.clozeText.split(' ');
        
        return (
            <div className="p-3 bg-gray-50 rounded">
                <div className="text-lg leading-relaxed">
                    {words.map((word, index) => {
                        const cleanWord = word.replace(/[^\w]/g, '');
                        const isBlank = question.blanks.some(blank => blank.wordIndex === index);
                        const punctuation = word.replace(/\w/g, '');
                        
                        if (!cleanWord) {
                            return <span key={index}>{word} </span>;
                        }

                        return (
                            <span key={index}>
                                {isBlank ? (
                                    <span className="inline-block border-b-2 border-black w-16 h-6 mx-1"></span>
                                ) : (
                                    <span>{cleanWord}</span>
                                )}
                                {punctuation && <span>{punctuation}</span>}
                                <span> </span>
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your sentence:
                </label>
                <textarea
                    value={question.clozeText}
                    onChange={(e) => updateClozeText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Type your sentence here..."
                />
            </div>

            {question.clozeText && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select words to blank out:
                        </label>
                        {renderInteractiveText()}
                    </div>

                    {question.blanks && question.blanks.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Configure answer options:
                            </label>
                            <div className="space-y-4">
                                {question.blanks.map((blank) => (
                                    <div key={blank.id} className="border border-gray-200 p-4 rounded-lg bg-white">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-medium text-gray-700">
                                                Blank: "{blank.word}"
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeBlank(blank.id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Remove this blank"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            {blank.options.map((option, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${blank.id}`}
                                                            checked={blank.correctAnswerIndex === index}
                                                            onChange={() => setCorrectAnswer(blank.id, index)}
                                                            className="text-green-600"
                                                            title="Mark as correct answer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => updateBlankOption(blank.id, index, e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder={`Option ${index + 1}`}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOptionFromBlank(blank.id, index)}
                                                        className="text-red-400 hover:text-red-600 p-1"
                                                        disabled={blank.options.length <= 1}
                                                        title="Remove option"
                                                    >
                                                        <XMarkIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            
                                            {blank.options.length < 5 && (
                                                <button
                                                    type="button"
                                                    onClick={() => addOptionToBlank(blank.id)}
                                                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                                                >
                                                    <PlusIcon className="h-4 w-4 mr-1" />
                                                    Add Option
                                                </button>
                                            )}
                                        </div>

                                        {/* Show warning if no correct answer is selected */}
                                        {blank.options.length > 0 && blank.correctAnswerIndex === undefined && (
                                            <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                                                ⚠️ Please select which option is the correct answer
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview:
                        </label>
                        {renderPreview()}
                    </div>
                </>
            )}
        </div>
    );
}