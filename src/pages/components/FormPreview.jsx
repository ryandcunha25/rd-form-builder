export default function FormPreview({ formData }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Preview</h3>
            <div className="border rounded-lg p-6 bg-gray-50">
                {formData.headerImage && (
                    <img
                        src={formData.headerImage}
                        alt="Form header"
                        className="w-full h-48 object-contain mb-4"
                        height={100}
                    />
                )}
                <h2 className="text-2xl font-bold mb-2">{formData.title || 'Form Title'}</h2>
                {formData.description && <p className="text-gray-600 mb-6">{formData.description}</p>}

                {formData.questions.length === 0 ? (
                    <p className="text-gray-500">No questions added yet</p>
                ) : (
                    <div className="space-y-6">
                        {formData.questions.map((question, index) => (
                            <div key={question.id} className="border-t pt-4">
                                <h4 className="font-medium mb-3">Question {index + 1}</h4>
                                {question.type === 'categorize' && (
                                    <div>
                                        <div className="flex gap-4 mb-4">
                                            {question.categories.map((category, i) => (
                                                <div key={i} className="border p-2 rounded flex-1">
                                                    <h5 className="font-medium text-center">{category}</h5>
                                                    <div className="min-h-20 mt-2 bg-gray-100 rounded p-2">
                                                        {question.items
                                                            .filter(item => item.category === category)
                                                            .map(item => (
                                                                <div key={item.id} className="bg-white p-1 mb-1 rounded shadow-xs">
                                                                    {item.text}
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-gray-100 p-3 rounded">
                                            <h5 className="font-medium mb-2">Items to categorize:</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {question.items.map(item => (
                                                    <div key={item.id} className="bg-white p-2 rounded shadow-xs">
                                                        {item.text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {question.type === 'cloze' && (
                                    <div>
                                        <p className="mb-4">
                                            {question.clozeText.split(' ').map((word, i) => {
                                                const blank = question.blanks.find(b => b.word === word);
                                                return blank ? (
                                                    <span key={i} className="inline-block mx-1 border-b-2 border-black w-20"></span>
                                                ) : (
                                                    <span key={i} className="inline-block mx-1">{word}</span>
                                                );
                                            })}
                                        </p>
                                        {question.blanks.length > 0 && (
                                            <div className="bg-gray-100 p-3 rounded">
                                                <h5 className="font-medium mb-2">Options:</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {question.blanks.flatMap(blank => blank.options).map((option, i) => (
                                                        <div key={i} className="bg-white p-2 rounded shadow-xs">
                                                            {option}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {question.type === 'comprehension' && (
                                    <div>
                                        <p className="mb-4 whitespace-pre-line">{question.passage}</p>
                                        <div className="space-y-4">
                                            {question.mcqs.map((mcq, i) => (
                                                <div key={i} className="border-l-4 border-blue-200 pl-4">
                                                    <p className="font-medium mb-2">{i + 1}. {mcq.question}</p>
                                                    <div className="space-y-2 ml-4">
                                                        {mcq.options.map((option, j) => (
                                                            <div key={j} className="flex items-center gap-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`preview-mcq-${i}`}
                                                                    checked={j === mcq.correctAnswer}
                                                                    readOnly
                                                                />
                                                                <label>{option}</label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}