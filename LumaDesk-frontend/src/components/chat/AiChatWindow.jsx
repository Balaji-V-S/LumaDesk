// src/components/chat/AiChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiChat } from '../../api/aiService';
import { Send, Loader2, User, Wand2, BotMessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

// Individual Message Bubble
const ChatBubble = ({ message }) => {
  const { role, text } = message;
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className="flex max-w-sm items-start gap-3">
        {!isUser && (
          <div className="flex-shrink-0 rounded-full bg-amber-100 p-2 text-amber-500">
            <Wand2 className="h-5 w-5" />
          </div>
        )}
        <div
          className={`rounded-lg p-3 shadow-sm ${
            isUser
              ? 'bg-amber-500 text-white'
              : 'bg-stone-100 text-stone-800'
          }`}
        >
          {text}
        </div>
        {isUser && (
          <div className="flex-shrink-0 rounded-full bg-stone-200 p-2 text-stone-700">
            <User className="h-5 w-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// The Main Chat Component
const AiChatWindow = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! How can I assist you with your LumaDesk tickets today?" },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previousContext, setPreviousContext] = useState('');
  
  const messagesEndRef = useRef(null); // To auto-scroll

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const query = input;
    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setInput('');
    setIsLoading(true);

    try {
      // Build the DTO
      const chatData = {
        role: user?.role || 'ROLE_CUSTOMER',
        previousContext: previousContext,
        query: query,
      };

      const response = await aiChat(chatData);
      
      const { answer, previousContext: newContext } = response.data;
      
      setMessages((prev) => [...prev, { role: 'ai', text: answer }]);
      setPreviousContext(newContext); // Save the history
      
    } catch (err) {
      console.error("AI Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: "Sorry, I'm having trouble connecting right now." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[70vh] flex-col rounded-lg border border-stone-200 bg-white">
      {/* Message List */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-full bg-amber-100 p-2 text-amber-500">
                <BotMessageSquare className="h-5 w-5" />
              </div>
              <div className="rounded-lg bg-stone-100 p-3 text-stone-500 shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-stone-200 bg-stone-50 p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading}
          className="block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
        />
        <Button type="submit" variant="primary" disabled={isLoading}>
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default AiChatWindow;