import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function CategorizeQuestion({ question, updateQuestion }) {
    const addCategory = () => {
        updateQuestion(question.id, {
            categories: [...question.categories, `Category ${question.categories.length + 1}`]
        });
    };

    const updateCategory = (index, value) => {
        const newCategories = [...question.categories];
        newCategories[index] = value;
        updateQuestion(question.id, { categories: newCategories });
    };

    const removeCategory = (index) => {
        const newCategories = question.categories.filter((_, i) => i !== index);
        updateQuestion(question.id, { categories: newCategories });
    };

    const addItem = () => {
        updateQuestion(question.id, {
            items: [...question.items, {
                id: Date.now().toString(),
                text: `Item ${question.items.length + 1}`,
                category: question.categories[0] || ''
            }]
        });
    };

    const updateItem = (itemId, updates) => {
        updateQuestion(question.id, {
            items: question.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
            )
        });
    };

    const removeItem = (itemId) => {
        updateQuestion(question.id, {
            items: question.items.filter(item => item.id !== itemId)
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                <div className="space-y-2">
                    {question.categories.map((category, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => updateCategory(index, e.target.value)}
                                className="flex-1 px-2 py-1 border rounded"
                            />
                            <button
                                type="button"
                                onClick={() => removeCategory(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addCategory}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Category
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
                <div className="space-y-2">
                    {question.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => updateItem(item.id, { text: e.target.value })}
                                className="flex-1 px-2 py-1 border rounded"
                            />
                            <select
                                value={item.category}
                                onChange={(e) => updateItem(item.id, { category: e.target.value })}
                                className="px-2 py-1 border rounded"
                            >
                                {question.categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addItem}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Item
                    </button>
                </div>
            </div>
        </div>
    );
}