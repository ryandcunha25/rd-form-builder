import { useState } from 'react';
import { 
    PhotoIcon,
    TrashIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import FieldEditor from './FieldEditor';

export default function FormEditor({
    formData, 
    setFormData,
    handleImageUpload,
    addQuestion,
    handleQuestionImageUpload,
    updateQuestion,
    removeQuestion
}) {
    const [activeTab, setActiveTab] = useState('categorize');

    return (
        <>
            <div className="mb-6 bg-white p-6 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">Form Header Image</label>
                {formData.headerImage ? (
                    <div className="relative">
                        <img
                            src={formData.headerImage}
                            alt="Header preview"
                            className="w-full h-48 object-contain rounded border"
                            height={100}
                        />
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, headerImage: '' })}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                        <PhotoIcon className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-600">Upload header image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            <div className="mb-6 bg-white p-6 rounded-lg shadow">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Form Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div className="mb-6 bg-white p-6 rounded-lg shadow">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                />
            </div>

            <div className="mb-6 bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            type="button"
                            onClick={() => setActiveTab('categorize')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'categorize' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Categorized Questions
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('cloze')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'cloze' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Fill in the Blanks
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('comprehension')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'comprehension' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Comprehension
                        </button>
                    </nav>
                </div>
                <div className="p-6">
                    <button
                        type="button"
                        onClick={() => addQuestion(activeTab)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add {activeTab === 'categorize' ? 'Categorize Question' :
                            activeTab === 'cloze' ? 'Cloze Question' : 'Comprehension Question'}
                    </button>
                </div>
            </div>

            <div className="space-y-6 mb-6">
                {formData.questions.map((question) => (
                    <FieldEditor 
                        key={question.id}
                        question={question}
                        handleQuestionImageUpload={handleQuestionImageUpload}
                        updateQuestion={updateQuestion}
                        removeQuestion={removeQuestion}
                    />
                ))}
            </div>
        </>
    );
}