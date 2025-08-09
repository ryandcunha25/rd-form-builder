// src/components/FieldEditor.js
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' },
];

export default function FieldEditor({ fields, addField, updateField, removeField }) {
  const [activeField, setActiveField] = useState(null);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    updateField('reorder', { items });
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Form Fields</h2>
        <div className="relative">
          <select
            onChange={(e) => addField(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
          >
            <option value="" disabled>Add Field</option>
            {fieldTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No fields added yet. Select a field type to add one.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white border rounded-md p-4 shadow-sm ${activeField === field.id ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div {...provided.dragHandleProps} className="flex items-center cursor-move">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span className="ml-2 text-sm font-medium text-gray-500">
                              {fieldTypes.find(t => t.value === field.type)?.label}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeField(field.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label htmlFor={`${field.id}-label`} className="block text-sm font-medium text-gray-700 mb-1">
                              Label
                            </label>
                            <input
                              type="text"
                              id={`${field.id}-label`}
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Field label"
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`${field.id}-required`}
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`${field.id}-required`} className="ml-2 block text-sm text-gray-700">
                              Required field
                            </label>
                          </div>

                          {['text'].includes(field.type) && (
                            <div>
                              <label htmlFor={`${field.id}-placeholder`} className="block text-sm font-medium text-gray-700 mb-1">
                                Placeholder
                              </label>
                              <input
                                type="text"
                                id={`${field.id}-placeholder`}
                                value={field.placeholder || ''}
                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Placeholder text"
                              />
                            </div>
                          )}

                          {['dropdown', 'radio'].includes(field.type) && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Options
                              </label>
                              <div className="space-y-2">
                                {field.options?.map((option, i) => (
                                  <div key={i} className="flex items-center">
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...field.options];
                                        newOptions[i] = e.target.value;
                                        updateField(field.id, { options: newOptions });
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newOptions = field.options.filter((_, idx) => idx !== i);
                                        updateField(field.id, { options: newOptions });
                                      }}
                                      className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = [...field.options, `Option ${field.options.length + 1}`];
                                  updateField(field.id, { options: newOptions });
                                }}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                              >
                                + Add Option
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}