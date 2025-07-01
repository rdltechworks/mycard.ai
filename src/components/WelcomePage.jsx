import React from 'react';
import { BookOpen } from 'lucide-react';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
          <BookOpen className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Scriptorium!</h1>
        <p className="text-gray-700 text-lg mb-6">
          We are diligently working to bring you an unparalleled experience in transforming your cherished memories into beautiful, personalized books.
        </p>
        <p className="text-gray-600 text-md mb-8">
          Our team is in the final stages of development, ensuring every detail is perfect for our launch. Stay tuned for exciting updates!
        </p>
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} RDL Techworks. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
