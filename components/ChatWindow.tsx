/**
 * Modern scrollable chat window component
 * Enhanced with auto-scroll behavior and performance optimizations
 */

import React, { useRef, useEffect } from 'react';
import { Message, Question } from '../lib/types';
import { MessageBubble } from './MessageBubble';
import { Card } from '@/components/ui/card';
import { Leaf, Brain, Zap } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  questions: Record<"disease" | "pest", Question[]>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, questions }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-6xl">
          {messages.length === 0 && (
            <div className="min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center">
              <Card className="max-w-2xl w-full text-center p-4 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="space-y-4 sm:space-y-6">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <h1 className="text-xl sm:text-3xl font-bold text-green-800">
                      Welcome to GreenBytes AI
                    </h1>
                    <p className="text-sm sm:text-lg text-green-700">
                      Advanced multimodal analysis for sugarcane health
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">AI-Powered Detection</p>
                        <p className="text-xs text-muted-foreground">YOLO + TabNet fusion</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">Real-time Analysis</p>
                        <p className="text-xs text-muted-foreground">Instant results</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 sm:pt-4 border-t border-green-200">
                    <p className="text-xs sm:text-sm text-green-600">
                      Select an analysis mode, upload an image, and answer the questionnaire to get started
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          <div className="space-y-4 sm:space-y-6">
            {messages.map((message) => {
              // Get questions for user messages based on their mode
              const messageQuestions = message.role === 'user' 
                ? questions[message.payload.mode]
                : undefined;
                
              return (
                <MessageBubble 
                  key={message.id}
                  message={message} 
                  questions={messageQuestions}
                />
              );
            })}
          </div>
          
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>
    </div>
  );
};
