import React, { useState, useRef } from 'react';
import { Upload, Calendar, FileText, Settings, Book, Loader2, CheckCircle, AlertCircle, Image, MessageCircle } from 'lucide-react';

const PersonalBookGenerator = () => {
  const [files, setFiles] = useState([]);
  const [timeline, setTimeline] = useState({ start: '', end: '' });
  const [prompt, setPrompt] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState('upload');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files) as File[];
    const processedFiles = uploadedFiles.map((file: File) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setFiles([...files, ...processedFiles]);
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleGenerateBook = async () => {
    if (files.length === 0 || !prompt.trim() || !timeline.start || !timeline.end) {
      alert('Please upload files, set timeline, and provide a prompt');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setCurrentStep('processing');

    try {
      // Simulate processing steps
      const steps = [
        { name: 'Uploading files...', duration: 2000 },
        { name: 'Extracting content...', duration: 3000 },
        { name: 'Vectorizing data...', duration: 4000 },
        { name: 'Organizing timeline...', duration: 2000 },
        { name: 'Generating book content...', duration: 5000 },
        { name: 'Finalizing format...', duration: 2000 }
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      }

      // This would be your actual API call to the private AI service
      const formData = new FormData();
      files.forEach(file => formData.append('files', file.file));
      formData.append('timeline', JSON.stringify(timeline));
      formData.append('prompt', prompt);

      // Placeholder for actual API call
      // const response = await fetch('/api/generate-book', {
      //   method: 'POST',
      //   body: formData
      // });

      setResult({
        title: 'My Personal Journey',
        pages: 24,
        chapters: 6,
        downloadUrl: '#',
        preview: 'Your personal book has been generated successfully! It contains a beautiful narrative of your memories organized chronologically with AI-enhanced storytelling.'
      });

      setCurrentStep('complete');
    } catch (error) {
      console.error('Error generating book:', error);
      setCurrentStep('error');
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setTimeline({ start: '', end: '' });
    setPrompt('');
    setResult(null);
    setProgress(0);
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Book className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personal Memory Book Generator</h1>
          <p className="text-gray-600 text-lg">Transform your photos and memories into a beautiful, AI-generated book</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['upload', 'configure', 'processing', 'complete'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step ? 'bg-purple-600 text-white' :
                  ['upload', 'configure', 'processing'].indexOf(currentStep) > index ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {['upload', 'configure', 'processing'].indexOf(currentStep) > index ?
                    <CheckCircle className="w-4 h-4" /> :
                    <span className="text-sm font-medium">{index + 1}</span>
                  }
                </div>
                {index < 3 && <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 'upload' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Upload className="w-6 h-6 mr-2 text-purple-600" />
              Upload Your Memories
            </h2>
           
            {/* File Upload Area */}
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
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Uploaded Files */}
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
                        onClick={() => removeFile(file.id)}
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
                onClick={() => setCurrentStep('configure')}
                className="w-full mt-6 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Continue to Configuration
              </button>
            )}
          </div>
        )}

        {currentStep === 'configure' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Settings className="w-6 h-6 mr-2 text-purple-600" />
              Configure Your Book
            </h2>

            {/* Timeline */}
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
                    onChange={(e) => setTimeline({...timeline, start: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={timeline.end}
                    onChange={(e) => setTimeline({...timeline, end: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Book Style & Prompt</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want your book to be written. For example: 'Create a heartwarming story about my family journey, focusing on growth and love. Use a warm, personal tone and organize events chronologically. Include reflections on important moments and relationships.'"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">The AI will use this prompt to understand your preferred writing style and focus.</p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep('upload')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Back
              </button>
              <button
                onClick={handleGenerateBook}
                disabled={!prompt.trim() || !timeline.start || !timeline.end}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Generate Book
              </button>
            </div>
          </div>
        )}

        {currentStep === 'processing' && (
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
        )}

        {currentStep === 'complete' && result && (
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

            <div className="flex space-x-4">
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

            <button
              onClick={resetForm}
              className="w-full mt-4 text-purple-600 hover:text-purple-800 font-medium"
            >
              Create Another Book
            </button>
          </div>
        )}

        {currentStep === 'error' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-red-800 mb-4">Processing Error</h2>
            <p className="text-gray-600 mb-6">We encountered an issue while generating your book. Please try again.</p>
            <button
              onClick={() => setCurrentStep('configure')}
              className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalBookGenerator;