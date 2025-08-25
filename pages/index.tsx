/**
 * Main chat page with modern UI - wires all components together
 * Optimized for performance and enhanced mobile responsiveness
 */

import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Message, Question, AnswerValue, UserMessage, AssistantMessage } from '../lib/types';
import { fetchPredict } from '../lib/fetchPredict';
import { ChatWindow } from '../components/ChatWindow';
import { Composer } from '../components/Composer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Activity, Zap } from 'lucide-react';
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
                
                {/* Beta Button */}
                <Link href="/multimodal">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 text-xs font-bold px-3 py-1 h-7 sm:h-8 sm:px-4"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">BETA</span>
                    <span className="sm:hidden">β</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Beta Banner - Show only when no messages */}
          {messages.length === 0 && (
            <div className="px-4 sm:px-6 py-4">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <Zap className="w-5 h-5 text-orange-600" />
                      <h3 className="text-lg font-bold text-orange-800">Try Our Advanced Beta Interface!</h3>
                    </div>
                    <p className="text-sm text-orange-700 mb-1">
                      Experience our latest multimodal analysis with enhanced UI and better visualization
                    </p>
                    <p className="text-xs text-orange-600">
                      ✨ Interactive questionnaires • 📊 Real-time progress tracking • 🖼️ Reference images
                    </p>
                  </div>
                  <Link href="/multimodal">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Launch Beta
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
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
