import React from 'react';
import { Settings, Calendar } from 'lucide-react';

const ConfigureStep = ({ timeline, onTimelineChange, prompt, onPromptChange, onBack, onGenerate }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Settings className="w-6 h-6 mr-2 text-purple-600" />
        Configure Your Book
      </h2>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={timeline.start}
              onChange={(e) => onTimelineChange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={timeline.end}
              onChange={(e) => onTimelineChange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Book Style & Prompt</h3>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe how you want your book to be written. For example: 'Create a heartwarming story about my family journey, focusing on growth and love. Use a warm, personal tone and organize events chronologically. Include reflections on important moments and relationships.'"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none"
        />
        <p className="text-sm text-gray-500 mt-2">The AI will use this prompt to understand your preferred writing style and focus.</p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Back
        </button>
        <button
          onClick={onGenerate}
          disabled={!prompt.trim() || !timeline.start || !timeline.end}
          className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Generate Book
        </button>
      </div>
    </div>
  );
};

export default ConfigureStep;
