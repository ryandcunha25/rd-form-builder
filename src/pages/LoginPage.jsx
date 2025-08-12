import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [error, setError] = useState(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      setError('No credential returned by Google');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/auth/google/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error', err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        {/* Main Login Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
              <h1 className="text-3xl font-bold text-white">Form Builder</h1>
              <p className="mt-2 text-blue-100">Create beautiful forms with ease</p>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">Welcome!</h2>
                <p className="mt-2 text-gray-600">Sign in to access your dashboard</p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => setError('Google Sign In failed. Please try again.')}
                  useOneTap
                  theme="filled_blue"
                  size="large"
                  shape="pill"
                  width="300"
                  text="continue_with"
                  locale="en_US"
                />

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    By signing in, you agree to our{' '}
                    <button 
                      onClick={() => setShowTermsModal(true)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Terms
                    </button>{' '}
                    and{' '}
                    <button 
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Policy Modal */}
        {showPrivacyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Privacy Policy</h3>
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Your Privacy Matters</h4>
                <p className="mb-4 text-gray-600">
                  At Form Builder, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
                </p>
                
                <h5 className="font-medium mt-6 mb-2 text-gray-800">Information We Collect</h5>
                <p className="mb-4 text-gray-600">
                  When you sign in with Google, we collect your name, email address, and profile picture to create your account. We may also collect usage data to improve our services.
                </p>
                
                <h5 className="font-medium mt-6 mb-2 text-gray-800">How We Use Your Information</h5>
                <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>To allow you to participate in interactive features</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis to improve our service</li>
                </ul>
                
                <h5 className="font-medium mt-6 mb-2 text-gray-800">Data Security</h5>
                <p className="mb-4 text-gray-600">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.
                </p>
                
                <h5 className="font-medium mt-6 mb-2 text-gray-800">Changes to This Policy</h5>
                <p className="mb-4 text-gray-600">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
                </p>
              </div>
              <div className="p-4 border-t flex justify-end">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Terms & Conditions Modal */}
        {showTermsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Terms & Conditions</h3>
                <button 
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Terms of Service</h4>
                <p className="mb-4 text-gray-600">
                  Welcome to Form Builder! These terms outline the rules and regulations for using our service.
                </p>
                
                <h5 className="font-medium mt-6 mb-2 text-gray-800">Acceptance of Terms</h5>
                <p className="mb-4 text-gray-600">
                  By accessing or using our service, you agree to be bound by these terms. If you disagree, please do not use our service.
                </p>
                
                <h5 className="font-medium mt-6 mb-2 text-gray-800">User Responsibilities</h5>
                <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
                  <li>You must be at least 13 years old to use this service</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree not to use the service for any illegal purpose</li>
                  <li>You will not upload harmful or malicious content</li>
                </ul>
                
                <h5 className="font-medium mt-6 mb-2 text-gray-800">Content Ownership</h5>
                <p className="mb-4 text-gray-600">
                  You retain ownership of any content you create using Form Builder. By using our service, you grant us a license to store and display this content as necessary to provide the service.
                </p>
                
                <h5 className="font-medium mt-6 mb-2 text-gray-800">Service Availability</h5>
                <p className="mb-4 text-gray-600">
                  We strive to maintain 24/7 availability but cannot guarantee uninterrupted service. We may perform maintenance or updates that temporarily limit access.
                </p>
                
                <h5 className="font-medium mt-6 mb-2 text-gray-800">Limitation of Liability</h5>
                <p className="mb-4 text-gray-600">
                  Form Builder shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
                </p>
              </div>
              <div className="p-4 border-t flex justify-end">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  I Agree
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}