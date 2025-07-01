import React from 'react';
import { Loader2 } from 'lucide-react';

const ProcessingStep = ({ progress }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
      <h2 className="text-2xl font-semibold mb-4">Creating Your Personal Book</h2>
      <p className="text-gray-600 mb-6">AI is processing your memories and crafting your story...</p>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500">{Math.round(progress)}% complete</p>
    </div>
  );
};

export default ProcessingStep;
