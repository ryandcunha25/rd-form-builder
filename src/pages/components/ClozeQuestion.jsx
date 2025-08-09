import React, { useState } from 'react';

const ClozeQuestion = ({ question, onChange }) => {
  const [text, setText] = useState(question.clozeText || '');
  const [blanks, setBlanks] = useState(question.blanks || []);
  const [selectedText, setSelectedText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
    onChange({ ...question, clozeText: e.target.value, blanks });
  };

  const addBlank = () => {
    if (selectedText) {
      const newBlanks = [...blanks, { answer: selectedText, hint: '' }];
      setBlanks(newBlanks);
      setText(text.replace(selectedText, '______'));
      setSelectedText('');
      onChange({ ...question, clozeText: text.replace(selectedText, '______'), blanks: newBlanks });
    }
  };

  const updateBlank = (index, field, value) => {
    const updatedBlanks = [...blanks];
    updatedBlanks[index][field] = value;
    setBlanks(updatedBlanks);
    onChange({ ...question, blanks: updatedBlanks });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Passage Text</label>
        <textarea
          value={text}
          onChange={handleTextChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={4}
        />
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Select text and click "Add Blank" to create fill-in-the-blank spaces
          </p>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={selectedText}
              onChange={(e) => setSelectedText(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm"
              placeholder="Or type text to blank out"
            />
            <button
              type="button"
              onClick={addBlank}
              className="px-3 py-1 bg-blue-500 text-white rounded-md"
            >
              Add Blank
            </button>
          </div>
        </div>
      </div>

      {blanks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Blank Answers</label>
          <div className="mt-2 space-y-2">
            {blanks.map((blank, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="font-medium">Blank {index + 1}:</span>
                <input
                  type="text"
                  value={blank.answer}
                  onChange={(e) => updateBlank(index, 'answer', e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm"
                  placeholder="Correct answer"
                />
                <input
                  type="text"
                  value={blank.hint}
                  onChange={(e) => updateBlank(index, 'hint', e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm"
                  placeholder="Hint (optional)"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClozeQuestion;