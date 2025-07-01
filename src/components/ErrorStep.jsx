import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorStep = ({ onRetry, errorMessage }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-red-800 mb-4">Processing Error</h2>
      <p className="text-gray-600 mb-6">{errorMessage || 'We encountered an issue while generating your book. Please try again.'}</p>
      <button
        onClick={onRetry}
        className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorStep;