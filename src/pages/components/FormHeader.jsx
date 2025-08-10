// src/components/FormHeader.js
import React from 'react';

export default function FormHeader({ headerImage, title, description, progress }) {
  return (
    <>
      {headerImage && (
        <div className="h-60 w-full overflow-hidden">
          <img 
            src={headerImage} 
            alt="Form header" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
          <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {progress}% Complete
          </div>
        </div>
      </div>
    </>
  );
}