import React from 'react';
import { CheckCircle, ShoppingCart, DollarSign } from 'lucide-react';

const CompleteStep = ({ result, onReset }) => {
  const handleStripePayment = () => {
    // Add your Stripe payment logic here
    alert('Redirecting to Stripe for payment...');
  };

  const handleAmazonPublish = () => {
    // Add your Amazon publishing logic here
    alert('Redirecting to Amazon KDP to publish your book...');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-green-800 mb-2">Book Generated Successfully!</h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">{result.title}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{result.pages}</p>
            <p className="text-sm text-gray-600">Pages</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{result.chapters}</p>
            <p className="text-sm text-gray-600">Chapters</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{result.preview}</p>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => alert('Preview feature coming soon!')}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Preview Book
        </button>
        <button
          onClick={() => alert('Download will start shortly!')}
          className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Download Book
        </button>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleStripePayment}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Pay with Stripe
        </button>
        <button
          onClick={handleAmazonPublish}
          className="flex-1 bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center justify-center"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Sell on Amazon
        </button>
      </div>

      <button
        onClick={onReset}
        className="w-full mt-4 text-purple-600 hover:text-purple-800 font-medium"
      >
        Create Another Book
      </button>
    </div>
  );
};

export default CompleteStep;
