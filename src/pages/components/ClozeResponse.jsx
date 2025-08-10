// src/components/ClozeResponse.js
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, useDroppable, useDraggable } from '@dnd-kit/core';

const DraggableOption = ({ option, id }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
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
      className={`px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-move select-none ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {option}
    </div>
  );
};

const DroppableBlank = ({ id, value, onChange, isOver }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <span
      ref={setNodeRef}
      className={`inline-block mx-1 px-3 py-1 min-w-[80px] text-center border-b-2 border-dashed ${
        isOver ? 'border-blue-500 bg-blue-100' : 'border-gray-400 bg-gray-50'
      } ${value ? 'bg-blue-50 border-blue-400 font-medium' : ''}`}
    >
      {value || '____'}
    </span>
  );
};

export default function ClozeResponse({ question, value = [], onChange }) {
  const blanks = question.blanks || [];
  const [allOptions, setAllOptions] = useState([]);
  const [usedOptions, setUsedOptions] = useState(new Set());
  const [dragOverBlank, setDragOverBlank] = useState(null);

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
    // Shuffle the options
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setDragOverBlank(null);
    
    if (over && over.id && over.id.startsWith('blank-')) {
      const blankIndex = parseInt(over.id.split('-')[1]);
      handleBlankChange(blankIndex, active.id);
    }
  };

  const handleDragOver = (event) => {
    const { over } = event;
    if (over && over.id && over.id.startsWith('blank-')) {
      const blankIndex = parseInt(over.id.split('-')[1]);
      setDragOverBlank(blankIndex);
    } else {
      setDragOverBlank(null);
    }
  };

  const clearBlank = (blankIndex) => {
    handleBlankChange(blankIndex, '');
  };

  const renderTextWithBlanks = () => {
    if (!question.clozeText) return null;
    
    if (blanks.length === 0) {
      return <p className="text-gray-500">No blanks available.</p>;
    }

    // console.log('Blanks data:', blanks);
    // console.log('Cloze text:', question.clozeText);

    // Method 1: If blanks have a 'word' property, replace exact word matches
    if (blanks.length > 0 && blanks[0].word) {
      let textWithBlanks = question.clozeText;
      let processedText = [];
      let currentIndex = 0;
      let blankCounter = 0;

      // Sort blanks by their position in the text if they have position info
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
          processedText.push(textWithBlanks.substring(currentIndex, wordIndex));
          
          // Add the blank component
          processedText.push(
            <DroppableBlank
              key={`blank-${blankCounter}`}
              id={`blank-${blankCounter}`}
              value={value[blankCounter]}
              onChange={(val) => handleBlankChange(blankCounter, val)}
              isOver={dragOverBlank === blankCounter}
            />
          );
          
          currentIndex = wordIndex + wordToReplace.length;
          blankCounter++;
        }
      }
      
      // Add remaining text
      processedText.push(textWithBlanks.substring(currentIndex));
      
      return (
        <div className="text-lg leading-relaxed">
          {processedText.map((part, index) => 
            typeof part === 'string' ? <span key={index}>{part}</span> : part
          )}
        </div>
      );
    }

    // // Method 2: If blanks have wordIndex, use word-based approach with better indexing
    // if (blanks.length > 0 && blanks[0].wordIndex !== undefined) {
    //   // Split into words while preserving spaces and punctuation
    //   const tokens = question.clozeText.split(/(\s+)/);
    //   let wordIndex = 0;
      
    //   // Create a map of word indices to blank indices
    //   const blankPositions = {};
    //   blanks.forEach((blank, idx) => {
    //     if (blank.wordIndex !== undefined) {
    //       blankPositions[blank.wordIndex] = idx;
    //     }
    //   });
      
    //   console.log('Blank positions map:', blankPositions);

    //   return (
    //     <div className="text-lg leading-relaxed">
    //       {tokens.map((token, tokenIndex) => {
    //         // If it's a space token, just return it
    //         if (/^\s+$/.test(token)) {
    //           return <span key={tokenIndex}>{token}</span>;
    //         }
            
    //         // It's a word token
    //         const isBlank = blankPositions.hasOwnProperty(wordIndex);
    //         console.log(`Token: "${token}", wordIndex: ${wordIndex}, isBlank: ${isBlank}`);
            
    //         if (isBlank) {
    //           const currentBlankIndex = blankPositions[wordIndex];
    //           wordIndex++;
    //           return (
    //             <DroppableBlank
    //               key={tokenIndex}
    //               id={`blank-${currentBlankIndex}`}
    //               value={value[currentBlankIndex]}
    //               onChange={(val) => handleBlankChange(currentBlankIndex, val)}
    //               isOver={dragOverBlank === currentBlankIndex}
    //             />
    //           );
    //         } else {
    //           wordIndex++;
    //           return <span key={tokenIndex}>{token}</span>;
    //         }
    //       })}
    //     </div>
    //   );
    // }

    // // Method 3: If blanks have position-based info, use character positions
    // if (blanks.length > 0 && (blanks[0].startPos !== undefined || blanks[0].position !== undefined)) {
    //   let textWithBlanks = question.clozeText;
    //   let offset = 0;
      
    //   // Sort blanks by position
    //   const sortedBlanks = [...blanks].sort((a, b) => 
    //     (a.startPos || a.position || 0) - (b.startPos || b.position || 0)
    //   );

    //   const result = [];
    //   let lastEnd = 0;

    //   sortedBlanks.forEach((blank, blankIndex) => {
    //     const startPos = blank.startPos || blank.position || 0;
    //     const endPos = blank.endPos || (startPos + (blank.word || '').length);
        
    //     // Add text before blank
    //     if (startPos > lastEnd) {
    //       result.push(textWithBlanks.substring(lastEnd, startPos));
    //     }
        
    //     // Add blank
    //     result.push(
    //       <DroppableBlank
    //         key={`blank-${blankIndex}`}
    //         id={`blank-${blankIndex}`}
    //         value={value[blankIndex]}
    //         onChange={(val) => handleBlankChange(blankIndex, val)}
    //         isOver={dragOverBlank === blankIndex}
    //       />
    //     );
        
    //     lastEnd = endPos;
    //   });
      
    //   // Add remaining text
    //   if (lastEnd < textWithBlanks.length) {
    //     result.push(textWithBlanks.substring(lastEnd));
    //   }

    //   return (
    //     <div className="text-lg leading-relaxed">
    //       {result.map((part, index) => 
    //         typeof part === 'string' ? <span key={index}>{part}</span> : part
    //       )}
    //     </div>
    //   );
    // }

    // Fallback: Just show the text with a message
    return (
      <div>
        <p className="text-lg leading-relaxed">{question.clozeText}</p>
        <p className="text-red-500 text-sm mt-2">
          Unable to locate blanks. Please check the blank data structure.
        </p>
        <div className="mt-2 text-xs text-gray-500">
          <details>
            <summary>Debug Info</summary>
            <pre>{JSON.stringify(blanks, null, 2)}</pre>
          </details>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
        <DndContext 
          onDragEnd={handleDragEnd} 
          onDragOver={handleDragOver}
          collisionDetection={closestCenter}
        >
          {renderTextWithBlanks()}
        </DndContext>
        
        {/* Show filled answers */}
        {/* {value.some(Boolean) && (
          <div className="mt-4 pt-4 border-t border-gray-300">
            <h5 className="text-sm font-medium text-gray-600 mb-2">Your answers:</h5>
            <div className="flex flex-wrap gap-2">
              {value.map((answer, index) => (
                answer && (
                  <div key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    <span>Blank {index + 1}: {answer}</span>
                    <button
                      onClick={() => clearBlank(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                      title="Clear this answer"
                    >
                      ×
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>
        )} */}
      </div>

      {allOptions.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-medium mb-3 text-gray-700">Available Options (Drag to blanks)</h4>
          <div className="flex flex-wrap gap-3">
            {allOptions.map((option, idx) => (
              <DraggableOption 
                key={`${option}-${idx}`} 
                id={option}
                option={option}
              />
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
        <p><strong>Instructions:</strong> Drag the options from below and drop them into the blanks in the sentence above. You can also click the × button next to your answers to clear them.</p>
      </div>
    </div>
  );
}