import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ClozeQuestion({ question, updateQuestion }) {
    const updateClozeText = (text) => {
        updateQuestion(question.id, { clozeText: text });
    };

    const addBlank = () => {
        const words = question.clozeText.split(' ');
        const wordToBlank = words[Math.floor(Math.random() * words.length)];

        updateQuestion(question.id, {
            blanks: [...question.blanks, {
                id: Date.now().toString(),
                word: wordToBlank,
                options: [wordToBlank, 'option1', 'option2']
            }]
        });
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

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sentence</label>
                <textarea
                    value={question.clozeText}
                    onChange={(e) => updateClozeText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    rows={3}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blanks</label>
                <div className="space-y-2">
                    {question.blanks.map((blank) => (
                        <div key={blank.id} className="border p-2 rounded">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Blank for: {blank.word}</span>
                                <button
                                    type="button"
                                    onClick={() => removeBlank(blank.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {blank.options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                                const newOptions = [...blank.options];
                                                newOptions[index] = e.target.value;
                                                updateBlank(blank.id, { options: newOptions });
                                            }}
                                            className="flex-1 px-2 py-1 border rounded"
                                        />
                                        {index === 0 && (
                                            <span className="text-xs text-gray-500">(Correct answer)</span>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newOptions = [...blank.options, `option${blank.options.length + 1}`];
                                        updateBlank(blank.id, { options: newOptions });
                                    }}
                                    className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                                >
                                    <PlusIcon className="h-3 w-3 mr-1" />
                                    Add Option
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addBlank}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Blank
                    </button>
                </div>
            </div>

            <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                <div className="p-3 bg-gray-50 rounded">
                    {question.clozeText.split(' ').map((word, index) => {
                        const blank = question.blanks.find(b => b.word === word);
                        return blank ? (
                            <span key={index} className="inline-block mx-1 border-b-2 border-black w-20"></span>
                        ) : (
                            <span key={index} className="inline-block mx-1">{word}</span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}