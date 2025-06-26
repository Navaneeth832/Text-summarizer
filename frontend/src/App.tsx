import React, { useState } from 'react';
import { Loader2, FileText, Sparkles, AlertCircle } from 'lucide-react';

interface SummaryResponse {
  summary: string;
}

function App() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    if (inputText.trim().length < 50) {
      setError('Please enter at least 50 characters for better summarization');
      return;
    }

    setError('');
    setIsLoading(true);
    setSummary('');

    try {
      const response = await fetch('http://localhost:8000/summarize/abstractive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SummaryResponse = await response.json();
      setSummary(data.summary || 'No summary available');
    } catch (err) {
      console.error('Summarization error:', err);
      setError('Failed to summarize text. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (error) setError('');
  };

  const characterCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Text Summarizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform lengthy text into concise, meaningful summaries using advanced Machine learning technology
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Input Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="text-input" className="flex items-center text-lg font-semibold text-gray-900">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Enter Your Text
                </label>
                <div className="text-sm text-gray-500">
                  {characterCount} characters • {wordCount} words
                </div>
              </div>
              
              <textarea
                id="text-input"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Paste or type your text here... (minimum 50 characters for best results)"
                className="w-full h-64 p-6 border-2 border-gray-200 rounded-2xl resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 leading-relaxed"
                disabled={isLoading}
              />
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Summarize Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleSummarize}
                disabled={isLoading || !inputText.trim()}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 focus:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    Summarize Text
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            {(summary || isLoading) && (
              <div className="border-t border-gray-100 pt-8">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                    Summary
                  </h3>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-blue-700 font-medium">Analyzing and summarizing your text...</p>
                        <p className="text-blue-600 text-sm mt-2">This may take a few moments</p>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-blue max-w-none">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap m-0 text-base">
                        {summary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12">
          <p className="text-gray-500 text-sm flex items-center justify-center">
            <Sparkles className="w-4 h-4 mr-2" />
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;