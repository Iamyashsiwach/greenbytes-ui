/**
 * Main chat page with modern UI - wires all components together
 * Optimized for performance and enhanced mobile responsiveness
 */

import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Message, Question, AnswerValue, UserMessage, AssistantMessage } from '../lib/types';
import { fetchPredict } from '../lib/fetchPredict';
import { ChatWindow } from '../components/ChatWindow';
import { Composer } from '../components/Composer';
import { Badge } from '@/components/ui/badge';
import { Leaf, Activity } from 'lucide-react';
import diseaseQuestions from '../public/data/disease_questions.json';
import esbQuestions from '../public/data/esb_questions.json';

const Home: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Record<"disease" | "pest", Question[]>>({
    disease: [],
    pest: []
  });

  // Load questions on mount
  useEffect(() => {
    setQuestions({
      disease: diseaseQuestions as Question[],
      pest: esbQuestions as Question[]
    });
  }, []);

  const handlePredict = async (
    mode: "disease" | "pest",
    image: File,
    answers: Record<string, AnswerValue>
  ) => {
    // Convert image to data URL for preview
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageDataUrl = reader.result as string;
      
      // Add user message
      const userMessage: UserMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        payload: {
          mode,
          imageDataUrl,
          answers
        }
      };
      setMessages(prev => [...prev, userMessage]);

      // Add temporary assistant message
      const tempAssistantMessage: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        payload: {
          status: 'Running AI analysis...'
        }
      };
      setMessages(prev => [...prev, tempAssistantMessage]);
      setIsLoading(true);

      try {
        // Convert answers object to ordered array
        const orderedAnswers = questions[mode].map(q => answers[q.key] || -1);
        
        // Call API
        const response = await fetchPredict(image, mode, orderedAnswers);
        
        // Replace temp message with real response
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempAssistantMessage.id
              ? { ...tempAssistantMessage, payload: response }
              : msg
          )
        );
      } catch (error) {
        // Replace temp message with error
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempAssistantMessage.id
              ? { 
                  ...tempAssistantMessage, 
                  payload: { 
                    status: 'Analysis failed',
                    error: error instanceof Error ? error.message : 'Connection error - please check if backend is running'
                  }
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.readAsDataURL(image);
  };

  return (
    <>
      <Head>
        <title>GreenBytes AI - Sugarcane Health Analysis</title>
        <meta name="description" content="Advanced AI-powered disease and pest detection for sugarcane using multimodal analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-green-800">GreenBytes AI</h1>
                    <p className="text-xs text-green-600 hidden sm:block">Sugarcane Health Analysis</p>
                  </div>
                </div>
                <Badge variant="secondary" className="hidden md:flex items-center gap-1 text-xs">
                  <Activity className="w-3 h-3" />
                  Multimodal Detection
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                  YOLO + TabNet
                </Badge>
                <Badge variant={isLoading ? "destructive" : "default"} className="text-xs">
                  {isLoading ? 'Processing' : 'Ready'}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <ChatWindow messages={messages} questions={questions} />
          <Composer 
            questions={questions} 
            onSubmit={handlePredict}
            disabled={isLoading}
          />
        </main>
      </div>
    </>
  );
};

export default Home;
