// src/components/FormHeader.js
import React from 'react';

export default function FormHeader({ headerImage, title, description, progress, onShare }) {
  return (
    <>
      {headerImage && (
        <div className="h-60 w-full overflow-hidden relative">
          <img 
            src={headerImage} 
            alt="Form header" 
            className="w-full h-full object-cover"
          />
          {/* Add share button on top of header image */}
          <button
            onClick={onShare}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-opacity-100 transition-all"
            title="Share this form"
            aria-label="Share form"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
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
          <div className="flex items-center gap-4">
            {!headerImage && (
              <button
                onClick={onShare}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Share this form"
                aria-label="Share form"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            )}
            <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {progress}% Complete
            </div>
          </div>
        </div>
      </div>
    </>
  );
}