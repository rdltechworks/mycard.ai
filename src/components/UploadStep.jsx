import React from 'react';
import { Upload, FileText, MessageCircle } from 'lucide-react';

const UploadStep = ({ files, onFileUpload, onRemoveFile, onNextStep }) => {
  const fileInputRef = React.useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Upload className="w-6 h-6 mr-2 text-purple-600" />
        Upload Your Memories
      </h2>

      <div
        className="border-2 border-dashed border-purple-200 rounded-lg p-8 text-center mb-4 hover:border-purple-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current.click()}
      >
        <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">Drop your photos and social media posts here</p>
        <p className="text-gray-500">or click to browse files</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.txt,.pdf,.doc,.docx,.json"
          onChange={onFileUpload}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">Uploaded Files ({files.length})</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  {file.type.startsWith('image/') ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      {file.type.includes('text') ? <MessageCircle className="w-6 h-6 text-blue-600" /> : <FileText className="w-6 h-6 text-blue-600" />}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={onNextStep}
          className="w-full mt-6 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Continue to Configuration
        </button>
      )}
    </div>
  );
};

export default UploadStep;
