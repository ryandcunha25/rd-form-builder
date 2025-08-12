import React from 'react';
import { ArrowPathIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FormHeader({ 
  headerImage, 
  title, 
  description, 
  progress, 
  onShare, 
  acceptingResponses, 
  onToggleAcceptingResponses,
  isTogglingAcceptance 
}) {
  return (
    <div className="relative">
      {/* Header Image Section */}
      {headerImage && (
        <div className="h-60 w-full overflow-hidden">
          <img 
            src={headerImage} 
            alt="Form header" 
            className="w-full h-full object-cover"
          />
          {/* Action Buttons Overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            {/* Accepting Responses Toggle */}
            <button
              onClick={onToggleAcceptingResponses}
              disabled={isTogglingAcceptance}
              className={`p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-opacity-100 transition-all ${
                isTogglingAcceptance ? 'cursor-not-allowed opacity-70' : ''
              }`}
              aria-label={
                acceptingResponses 
                  ? 'Currently accepting responses - click to stop' 
                  : 'Not accepting responses - click to start'
              }
            >
              {isTogglingAcceptance ? (
                <ArrowPathIcon className="h-5 w-5 text-gray-700 animate-spin" />
              ) : (
                <>
                  {acceptingResponses ? (
                    <CheckIcon className="h-5 w-5 text-green-600" />
                  ) : (
                    <XMarkIcon className="h-5 w-5 text-red-600" />
                  )}
                </>
              )}
            </button>
            
            {/* Share Button */}
            <button
              onClick={onShare}
              className="p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-opacity-100 transition-all"
              aria-label="Share this form"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-700" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Header Content Section */}
      <div className="px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          {/* Title and Description */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
          
          {/* Action Buttons (for no header image) */}
          {!headerImage && (
            <div className="flex items-center gap-4">
              {/* Accepting Responses Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleAcceptingResponses}
                  disabled={isTogglingAcceptance}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    acceptingResponses ? 'bg-green-500' : 'bg-gray-300'
                  } ${isTogglingAcceptance ? 'opacity-70 cursor-not-allowed' : ''}`}
                  aria-label={
                    acceptingResponses 
                      ? 'Currently accepting responses - click to stop' 
                      : 'Not accepting responses - click to start'
                  }
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      acceptingResponses ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  >
                    {isTogglingAcceptance && (
                      <ArrowPathIcon className="h-3 w-3 text-gray-600 animate-spin" />
                    )}
                  </span>
                </button>
                <span className="text-sm text-gray-500">
                  {acceptingResponses ? 'Active' : 'Paused'}
                </span>
              </div>
              
              {/* Share Button */}
              <button
                onClick={onShare}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Share this form"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
                  />
                </svg>
              </button>
            </div>
          )}
          
          {/* Progress Indicator */}
          <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {progress}% Complete
          </div>
        </div>
        
        {/* Status Message */}
        {acceptingResponses? acceptingResponses && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XMarkIcon className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  This form is currently not accepting responses. Toggle the switch above to enable responses.
                </p>
              </div>
            </div>
          </div>
        ): ''}
      </div>
    </div>
  );
}