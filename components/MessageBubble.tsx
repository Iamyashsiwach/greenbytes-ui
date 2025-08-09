/**
 * Component for chat message bubbles (user and assistant variants)
 */

import React from 'react';
import { Message, PredictResponse, Question } from '../lib/types';
import { AnswersTable } from './AnswersTable';
import { ModelSummary } from './ModelSummary';
import { RefImage } from './RefImage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Bot, Loader2, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  questions?: Question[]; // For user messages
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, questions }) => {
  if (message.role === 'user') {
    const { mode, imageDataUrl, answers } = message.payload;
    
    return (
      <div className="flex justify-end mb-4 sm:mb-6">
        <div className="max-w-sm sm:max-w-md lg:max-w-4xl w-full">
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1">
              <Card className="message-bubble-user">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {mode === 'disease' ? '🦠 Disease Analysis' : '🐛 Pest Detection'}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {mode === 'disease' ? 'Dead Heart' : 'Early Shoot Borer'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-center">
                      <img 
                        src={imageDataUrl} 
                        alt="Uploaded sugarcane" 
                        className="max-w-48 max-h-48 sm:max-w-64 sm:max-h-64 object-cover rounded-lg border-2 border-white/20 shadow-lg"
                      />
                    </div>
                    
                    {questions && (
                      <AnswersTable questions={questions} answers={answers} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Assistant message
  const payload = message.payload;
  
  // Handle status/error messages
  if ('status' in payload) {
    return (
      <div className="flex justify-start mb-4 sm:mb-6">
        <div className="max-w-sm sm:max-w-md lg:max-w-4xl w-full">
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-muted rounded-full flex items-center justify-center">
              {payload.error ? (
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
              ) : (
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-primary" />
              )}
            </div>
            <div className="flex-1">
              <Card className="message-bubble-assistant">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="text-sm font-medium">GreenBytes AI</span>
                  </div>
                  
                  <div className="text-center py-3 sm:py-4">
                    <p className="text-muted-foreground">{payload.status}</p>
                    {payload.error && (
                      <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">{payload.error}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle prediction response
  const response = payload as PredictResponse;
  
  return (
    <div className="flex justify-start mb-4 sm:mb-6">
      <div className="max-w-full w-full">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <Card className="message-bubble-assistant">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-sm font-medium">GreenBytes AI Analysis</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {response.mode === 'disease' ? '🦠 Disease' : '🐛 Pest'}
                  </Badge>
                </div>
                
                <ModelSummary 
                  yolo={response.yolo}
                  tabnet={response.tabnet}
                  fusion={response.fusion}
                />
                
                {response.fusion.present && (
                  <RefImage 
                    mode={response.mode}
                    filename={response.ref_img}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
