// src/components/ClozeResponse.js
import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    useDroppable,
    useDraggable,
    DragOverlay
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const DraggableOption = ({ option, id, isUsed }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        disabled: isUsed, // Disable dragging if already used
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 1000 : 1,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`px-4 py-2 border rounded-lg shadow-sm select-none transition-all ${isDragging
                    ? 'opacity-50 bg-blue-100 border-blue-300'
                    : isUsed
                        ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-gray-300 cursor-move hover:bg-gray-50 hover:border-gray-400'
                }`}
        >
            {option}
        </div>
    );
};

const DroppableBlank = ({ id, value, blankIndex, isOver, onClear }) => {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <span
            ref={setNodeRef}
            className={`inline-flex items-center mx-1 px-3 py-1 min-w-[100px] text-center border-b-2 border-dashed transition-all ${isOver
                    ? 'border-blue-500 bg-blue-100 scale-105'
                    : value
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-400 bg-gray-50 hover:border-gray-500'
                }`}
        >
            {value ? (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-800">{value}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClear(blankIndex);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm font-bold ml-1"
                        title="Clear this answer"
                    >
                        ×
                    </button>
                </div>
            ) : (
                <span className="text-gray-400">____</span>
            )}
        </span>
    );
};

export default function ClozeResponse({ question, value = [], onChange }) {
    const blanks = question.blanks || [];
    const [allOptions, setAllOptions] = useState([]);
    const [usedOptions, setUsedOptions] = useState(new Set());
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        // Collect all unique options from all blanks
        const options = [];
        blanks.forEach(blank => {
            (blank.options || []).forEach(option => {
                if (option && !options.includes(option)) {
                    options.push(option);
                }
            });
        });
        // Shuffle the options for better UX
        const shuffled = [...options].sort(() => Math.random() - 0.5);
        setAllOptions(shuffled);
    }, [blanks]);

    useEffect(() => {
        // Track used options
        setUsedOptions(new Set(value.filter(Boolean)));
    }, [value]);

    const handleBlankChange = (blankIndex, answer) => {
        const updated = [...value];
        // Ensure the array is long enough
        while (updated.length <= blankIndex) {
            updated.push('');
        }
        updated[blankIndex] = answer;
        onChange(updated);
    };

    const clearBlank = (blankIndex) => {
        handleBlankChange(blankIndex, '');
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && over.id && over.id.startsWith('blank-')) {
            const blankIndex = parseInt(over.id.split('-')[1]);
            const draggedOption = active.id;

            // Check if this option is already used in another blank
            const currentBlankValue = value[blankIndex];
            if (currentBlankValue && currentBlankValue !== draggedOption) {
                // If the blank already has a value, we need to swap or replace
                // For now, let's just replace
            }

            handleBlankChange(blankIndex, draggedOption);
        }
    };

    const renderTextWithBlanks = () => {
        if (!question.clozeText) {
            return <p className="text-gray-500">No cloze text available.</p>;
        }

        if (blanks.length === 0) {
            return (
                <div>
                    <p className="text-lg leading-relaxed">{question.clozeText}</p>
                    <p className="text-orange-500 text-sm mt-2">No blanks configured for this question.</p>
                </div>
            );
        }

        // Method 1: If blanks have a 'word' property, replace exact word matches
        if (blanks.length > 0 && blanks[0].word) {
            let textWithBlanks = question.clozeText;
            let processedText = [];
            let currentIndex = 0;
            let blankCounter = 0;

            // Sort blanks by their position in the text
            const sortedBlanks = [...blanks].sort((a, b) => {
                const aPos = textWithBlanks.indexOf(a.word);
                const bPos = textWithBlanks.indexOf(b.word);
                return aPos - bPos;
            });

            for (const blank of sortedBlanks) {
                const wordToReplace = blank.word;
                const wordIndex = textWithBlanks.indexOf(wordToReplace, currentIndex);

                if (wordIndex !== -1) {
                    // Add text before the blank
                    if (wordIndex > currentIndex) {
                        processedText.push(textWithBlanks.substring(currentIndex, wordIndex));
                    }

                    // Add the blank component
                    processedText.push(
                        <DroppableBlank
                            key={`blank-${blankCounter}`}
                            id={`blank-${blankCounter}`}
                            value={value[blankCounter]}
                            blankIndex={blankCounter}
                            isOver={false} // We'll handle this in DndContext
                            onClear={clearBlank}
                        />
                    );

                    currentIndex = wordIndex + wordToReplace.length;
                    blankCounter++;
                }
            }

            // Add remaining text
            if (currentIndex < textWithBlanks.length) {
                processedText.push(textWithBlanks.substring(currentIndex));
            }

            return (
                <div className="text-lg leading-relaxed">
                    {processedText.map((part, index) =>
                        typeof part === 'string' ? <span key={index}>{part}</span> : part
                    )}
                </div>
            );
        }

        // Fallback: Show text with numbered blanks
        return (
            <div className="space-y-4">
                <p className="text-lg leading-relaxed">{question.clozeText}</p>
                <div className="grid gap-3">
                    <p className="text-sm text-gray-600 font-medium">Fill in the blanks:</p>
                    {blanks.map((blank, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                                Blank {index + 1}:
                            </span>
                            <DroppableBlank
                                id={`blank-${index}`}
                                value={value[index]}
                                blankIndex={index}
                                isOver={false}
                                onClear={clearBlank}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const activeOption = allOptions.find(option => option === activeId);

    return (
        <div className="space-y-6">
            <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                collisionDetection={closestCenter}
            >
                {/* Cloze text with blanks */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                    {renderTextWithBlanks()}
                </div>

                {/* Drag overlay for better visual feedback */}
                <DragOverlay>
                    {activeOption ? (
                        <div className="px-4 py-2 bg-blue-100 border-2 border-blue-300 rounded-lg shadow-lg">
                            {activeOption}
                        </div>
                    ) : null}
                </DragOverlay>

                {/* Available options */}
                {allOptions.length > 0 && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="font-medium mb-3 text-gray-700">
                            Available Options
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Drag to blanks above)
                            </span>
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {allOptions.map((option, idx) => (
                                <DraggableOption
                                    key={`${option}-${idx}`}
                                    id={option}
                                    option={option}
                                    isUsed={usedOptions.has(option)}
                                />
                            ))}
                        </div>

                        {/* Show usage status */}
                        <div className="mt-3 text-xs text-gray-500">
                            {usedOptions.size > 0 && (
                                <p>Used: {Array.from(usedOptions).join(', ')}</p>
                            )}
                        </div>
                    </div>
                )}
            </DndContext>

            {/* Instructions */}
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p>
                    <strong>Instructions:</strong> Drag the options from the bottom section and drop them into the blanks above.
                    Click the × button next to any filled blank to clear it. Used options will appear grayed out.
                </p>
            </div>

            {/* Debug info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
                <details className="text-xs text-gray-400">
                    <summary>Debug Information</summary>
                    <div className="mt-2 space-y-1">
                        <p>Blanks count: {blanks.length}</p>
                        <p>All options: {JSON.stringify(allOptions)}</p>
                        <p>Current values: {JSON.stringify(value)}</p>
                        <p>Used options: {JSON.stringify(Array.from(usedOptions))}</p>
                    </div>
                </details>
            )}
        </div>
    );
}