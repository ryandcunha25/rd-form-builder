function FormPreview({ formData, questions }) {
    return (
        <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-white">
            <h2 className="text-xl font-semibold mb-4">Form Preview</h2>
            
            {/* Header Image */}
            {formData.headerImage && (
                <div className="mb-6">
                    <img 
                        src={formData.headerImage} 
                        alt="Form header" 
                        className="w-full max-h-64 object-contain rounded"
                    />
                </div>
            )}
            
            {/* Form Title & Description */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {formData.title || 'Untitled Form'}
                </h1>
                <p className="text-gray-600">
                    {formData.description || 'No description provided'}
                </p>
            </div>
            
            {/* Questions */}
            <div className="space-y-6">
                {questions.map((question, index) => (
                    <div key={question._id} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-700">
                                Question {index + 1} {question.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </h3>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                {question.type}
                            </span>
                        </div>
                        
                        {/* Question Image */}
                        {question.image && (
                            <div className="mb-3">
                                <img 
                                    src={question.image} 
                                    alt="Question visual" 
                                    className="max-h-48 object-contain rounded"
                                />
                            </div>
                        )}
                        
                        {/* Question Text */}
                        <p className="mb-4 font-medium">
                            {question.questionText || 'No question text provided'}
                        </p>
                        
                        {/* Render different question types */}
                        {question.type === 'multiple-choice' && (
                            <div className="space-y-2">
                                {question.options?.map((option, i) => (
                                    <div key={i} className="flex items-center">
                                        <input type="radio" name={`q-${question.id}`} className="mr-2" />
                                        <span>{option}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {question.type === 'categorize' && (
                            <div>
                                <div className="mb-3">
                                    <h4 className="font-medium mb-1">Categories:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {question.categories?.map((cat, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-200 rounded">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Items:</h4>
                                    <div className="space-y-2">
                                        {question.items?.map((item, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span>{item.text}</span>
                                                <span className="text-gray-500">→</span>
                                                <span className="px-2 py-1 bg-gray-200 rounded">
                                                    {item.category}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {question.type === 'cloze' && (
                            <div>
                                <p className="whitespace-pre-wrap mb-3">
                                    {question.clozeText?.split(' ').map((word, i) => (
                                        question.blanks?.some(b => b.position === i) ? (
                                            <span key={i} className="inline-block mx-1 w-24 border-b-2 border-gray-400"></span>
                                        ) : (
                                            <span key={i}> {word} </span>
                                        )
                                    ))}
                                </p>
                            </div>
                        )}
                        
                        {question.type === 'comprehension' && (
                            <div>
                                <div className="mb-3 p-3 bg-gray-100 rounded">
                                    <p className="whitespace-pre-wrap">{question.passage}</p>
                                </div>
                                <div className="space-y-4">
                                    {question.mcqs?.map((mcq, i) => (
                                        <div key={i} className="p-3 border border-gray-200 rounded">
                                            <p className="font-medium mb-2">{mcq.question}</p>
                                            <div className="space-y-2">
                                                {mcq.options?.map((opt, j) => (
                                                    <div key={j} className="flex items-center">
                                                        <input type="radio" name={`mcq-${mcq.id}`} className="mr-2" />
                                                        <span>{opt}</span>
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
            
            {/* Respondent Info Collection */}
            {formData.collectRespondentInfo && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-medium mb-3">Respondent Information</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input 
                                disabled
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                            disabled
                                type="email" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormPreview;