import React, { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  PointerSensor, 
  useSensor, 
  useSensors,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const DraggableItem = ({ id, text }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: 'grab',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm mb-2 select-none hover:shadow-md transition-shadow"
    >
      {text}
    </div>
  );
};

const DroppableCategory = ({ id, title, items, onRemove }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-lg border-2 transition-colors ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
      } min-h-[150px]`}
    >
      <h3 className="font-medium text-center mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            <div className="p-2 bg-white border border-gray-200 rounded-lg flex justify-between items-center">
              <span>{item.text}</span>
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from category"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-2">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
};

// Separate component for uncategorized items area
const ItemsContainer = ({ items }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'uncategorized',
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-lg border border-gray-200 min-h-[150px] transition-colors ${
        isOver ? 'bg-gray-100' : 'bg-gray-50'
      }`}
    >
      {items.length > 0 ? (
        items.map(item => (
          <DraggableItem 
            key={item.id} 
            id={item.id} 
            text={item.text} 
          />
        ))
      ) : (
        <div className="text-center text-gray-400 text-sm py-2">
          All items categorized
        </div>
      )}
    </div>
  );
};

export default function CategorizeResponse({ question, value, onChange }) {
  const [categories] = useState(question.categories);
  const [items] = useState(question.items);
  const [activeId, setActiveId] = useState(null);

  // Configure sensors for different input methods
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const getItemCategory = (itemId) => {
    const responseItem = value.find(i => i.itemId === itemId);
    return responseItem ? responseItem.category : null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // If dropped on a category
    if (categories.includes(over.id)) {
      const updated = value.filter(item => item.itemId !== active.id);
      updated.push({ itemId: active.id, category: over.id });
      onChange(updated);
    }
    // If dropped back on uncategorized area
    else if (over.id === 'uncategorized') {
      const updated = value.filter(item => item.itemId !== active.id);
      onChange(updated);
    }
  };

  const handleRemoveFromCategory = (itemId) => {
    const updated = value.filter(item => item.itemId !== itemId);
    onChange(updated);
  };

  // Get active item data for overlay
  const activeItem = activeId ? items.find(item => item.id === activeId) : null;

  // Get uncategorized items
  const uncategorizedItems = items.filter(item => !getItemCategory(item.id));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Items Column */}
          <div>
            <h4 className="font-medium mb-3 text-gray-700">Items</h4>
            <ItemsContainer items={uncategorizedItems} />
          </div>
          
          {/* Categories Column */}
          <div>
            <h4 className="font-medium mb-3 text-gray-700">Categories</h4>
            <div className="grid grid-cols-1 gap-4">
              {categories.map((category) => {
                const categoryItems = items
                  .filter(item => getItemCategory(item.id) === category)
                  .map(item => ({ id: item.id, text: item.text }));

                return (
                  <DroppableCategory
                    key={category}
                    id={category}
                    title={category}
                    items={categoryItems}
                    onRemove={handleRemoveFromCategory}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Drag Preview */}
      <DragOverlay>
        {activeItem ? (
          <div className="p-3 bg-white border border-blue-300 rounded-lg shadow-lg">
            {activeItem.text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}