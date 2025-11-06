// src/pages/AiChatPage.jsx
import React, { useState, useEffect } from 'react';
import { getAiHealth } from '../api/aiService';
import { Loader2, AlertCircle, XCircle } from 'lucide-react';
import AiChatWindow from '../components/chat/AiChatWindow';
import { motion } from 'framer-motion';

const AiChatPage = () => {
  const [isApiActive, setIsApiActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await getAiHealth();
        if (response.data === 'Gemini model is active and responding.') {
          setIsApiActive(true);
        } else {
          setErrorMsg(response.data || 'AI service is unavailable.');
        }
      } catch (err) {
        console.error('AI Health Check Failed:', err);
        setErrorMsg('The AI service is not reachable. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    checkHealth();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-stone-500">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
          <p className="mt-4">Connecting to AI Agent...</p>
        </div>
      );
    }

    if (!isApiActive) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg bg-rose-50 p-12 text-rose-600">
          <XCircle className="h-12 w-12" />
          <h2 className="mt-4 text-xl font-semibold">Service Unavailable</h2>
          <p className="mt-1 text-center">{errorMsg}</p>
        </div>
      );
    }
    
    // If active, render the chat window
    return <AiChatWindow />;
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto" // Center the chat page
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-stone-800">AI Support Agent</h1>
        {isApiActive && (
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-lime-400"></div>
            <span className="text-sm font-medium text-lime-600">
              Model Active
            </span>
          </div>
        )}
      </div>
      
      {/* This renders the loading, error, or chat component */}
      <div className="rounded-lg bg-white shadow-sm overflow-hidden">
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default AiChatPage;