import React, { useState, useCallback } from 'react';
import { Book, CheckCircle } from 'lucide-react';

import UploadStep from './components/UploadStep';
import ConfigureStep from './components/ConfigureStep';
import ProcessingStep from './components/ProcessingStep';
import CompleteStep from './components/CompleteStep';
import ErrorStep from './components/ErrorStep';
import WelcomePage from './components/WelcomePage'; // Import the new WelcomePage

const PersonalBookGenerator = () => {
  const [files, setFiles] = useState([]);
  const [timeline, setTimeline] = useState({ start: '', end: '' });
  const [prompt, setPrompt] = useState('');
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState(null);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState('upload');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = useCallback((event) => {
    const uploadedFiles = Array.from(event.target.files);
    const processedFiles = uploadedFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setFiles(prevFiles => [...prevFiles, ...processedFiles]);
  }, []);

  const removeFile = useCallback((id) => {
    setFiles(prevFiles => prevFiles.filter(f => f.id !== id));
  }, []);

  const pollJobStatus = useCallback(async (id) => {
    let jobStatus = {};
    let attempts = 0;
    const maxAttempts = 60; // Poll for up to 5 minutes (60 * 5 seconds)

    while (jobStatus.status !== 'COMPLETED' && jobStatus.status !== 'FAILED' && attempts < maxAttempts) {
      attempts++;
      try {
        const response = await fetch(`/api/status?jobId=${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        jobStatus = await response.json();
        setProgress(jobStatus.progress || 0);

        if (jobStatus.status === 'COMPLETED') {
          setResult({
            title: 'My Personal Journey',
            pages: 'Generated',
            chapters: 'Generated',
            downloadUrl: `/api/download?jobId=${id}`,
            preview: 'Your personal book has been generated successfully! Click download to view it.'
          });
          setCurrentStep('complete');
        } else if (jobStatus.status === 'FAILED') {
          setErrorMessage(jobStatus.error || 'An unknown error occurred during processing.');
          setCurrentStep('error');
        }
      } catch (error) {
        console.error('Polling error:', error);
        setErrorMessage(`Failed to poll job status: ${error.message}`);
        setCurrentStep('error');
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
    }

    if (attempts >= maxAttempts && jobStatus.status !== 'COMPLETED' && jobStatus.status !== 'FAILED') {
      setErrorMessage('Job timed out. Please try again.');
      setCurrentStep('error');
    }
  }, []);

  const handleGenerateBook = async () => {
    if (files.length === 0 || !prompt.trim() || !timeline.start || !timeline.end) {
      alert('Please upload files, set timeline, and provide a prompt');
      return;
    }

    setCurrentStep('processing');
    setProgress(0);
    setErrorMessage('');

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file.file));
      formData.append('timeline', JSON.stringify(timeline));
      formData.append('prompt', prompt);

      const response = await fetch('/api/generate-book', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJobId(data.jobId);
      pollJobStatus(data.jobId); // Start polling for status

    } catch (error) {
      console.error('Error initiating book generation:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setCurrentStep('error');
    }
  };

  const resetForm = () => {
    setFiles([]);
    setTimeline({ start: '', end: '' });
    setPrompt('');
    setResult(null);
    setProgress(0);
    setJobId(null);
    setErrorMessage('');
    setCurrentStep('upload');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <UploadStep
            files={files}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            onNextStep={() => setCurrentStep('configure')}
          />
        );
      case 'configure':
        return (
          <ConfigureStep
            timeline={timeline}
            onTimelineChange={setTimeline}
            prompt={prompt}
            onPromptChange={setPrompt}
            onBack={() => setCurrentStep('upload')}
            onGenerate={handleGenerateBook}
          />
        );
      case 'processing':
        return <ProcessingStep progress={progress} />;
      case 'complete':
        return <CompleteStep result={result} onReset={resetForm} />;
      case 'error':
        return <ErrorStep onRetry={() => setCurrentStep('configure')} errorMessage={errorMessage} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Book className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personal Memory Book Generator</h1>
          <p className="text-gray-600 text-lg">Transform your photos and memories into a beautiful, AI-generated book</p>
        </div>

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

        {renderStep()}
      </div>
    </div>
  );
};

// New root component to conditionally render WelcomePage or PersonalBookGenerator
const App = () => {
  const [showWelcome, setShowWelcome] = useState(true); // Set to true to show welcome page initially

  if (showWelcome) {
    return <WelcomePage />;
  } else {
    return <PersonalBookGenerator />;
  }
};

export default App;
