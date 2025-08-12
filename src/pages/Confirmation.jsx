import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ArrowLeftIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    success = 'Form submitted successfully!',
    answeredCount = 0,
    totalQuestions = 0,
    score = 0,
    maxScore = 100,
    percentage = 0
  } = location.state || {};

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleCopyScore = () => {
    navigator.clipboard.writeText(
      `I scored ${score}/${maxScore} (${percentage}%) on this assessment!`
    );
    // You could add a toast notification here to show "Copied!"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
              <CheckCircleIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{success}</h1>
            <p className="text-green-100 text-lg">
              Thank you for completing the form!
            </p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10">
            {/* Stats Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {answeredCount}/{totalQuestions}
                </div>
                <div className="text-sm font-medium text-blue-800">
                  Questions Answered
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {score}/{maxScore}
                </div>
                <div className="text-sm font-medium text-green-800">
                  Points Earned
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {percentage}%
                </div>
                <div className="text-sm font-medium text-purple-800">
                  Overall Score
                </div>
              </div>
            </div> */}

            {/* Progress Bar */}
            {/* <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Your score
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div> */}

            {/* Feedback Message */}
            {/* <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mb-8">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">
                {percentage >= 80 ? 'Excellent Work!' : 
                 percentage >= 50 ? 'Good Job!' : 'Keep Practicing!'}
              </h3>
              <p className="text-indigo-700">
                {percentage >= 80 ? 'You have demonstrated a strong understanding of the material.' :
                 percentage >= 50 ? 'You have a good foundation, with room for improvement.' :
                 'Review the material and try again to improve your score.'}
              </p>
            </div> */}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleGoBack}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Return to Dashboard
              </button>

              {maxScore > 0 && (
                <button
                  onClick={handleCopyScore}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center justify-center"
                >
                  <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                  Copy My Score
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}