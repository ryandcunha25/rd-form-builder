import React, { useState } from 'react';

const CategorizeQuestion = ({ question, onChange }) => {
  const [categories, setCategories] = useState(question.categories || []);
  const [items, setItems] = useState(question.items || []);
  const [newCategory, setNewCategory] = useState('');
  const [newItem, setNewItem] = useState('');

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { text: newItem.trim(), belongsTo: '' }]);
      setNewItem('');
    }
  };

  const updateItemCategory = (itemIndex, category) => {
    const updatedItems = [...items];
    updatedItems[itemIndex].belongsTo = category;
    setItems(updatedItems);
    onChange({ ...question, categories, items: updatedItems });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Categories</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm"
            placeholder="Add new category"
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-3 py-1 bg-blue-500 text-white rounded-md"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((cat, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 rounded-md">
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Items to Categorize</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm"
            placeholder="Add new item"
          />
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1 bg-blue-500 text-white rounded-md"
          >
            Add
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="flex-1">{item.text}</span>
              <select
                value={item.belongsTo}
                onChange={(e) => updateItemCategory(index, e.target.value)}
                className="rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select category</option>
                {categories.map((cat, catIndex) => (
                  <option key={catIndex} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorizeQuestion;