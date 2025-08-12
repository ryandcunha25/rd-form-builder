import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      console.error('No credential returned by Google');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/auth/google/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Save your app JWT and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect or update state
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error', err);
      alert(err.message || 'Login failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Sign in to Form Builder</h1>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert('Google Sign In failed')}
          useOneTap
        />
      </div>
    </GoogleOAuthProvider>
  );
}
