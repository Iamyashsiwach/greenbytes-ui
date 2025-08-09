/**
 * Component to display the 10 Q&A in a modern card format
 */

import React from 'react';
import { Question, AnswerValue } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface AnswersTableProps {
  questions: Question[];
  answers: Record<string, AnswerValue>;
}

export const AnswersTable: React.FC<AnswersTableProps> = ({ questions, answers }) => {
  const getAnswerInfo = (value: AnswerValue) => {
    switch (value) {
      case -1: 
        return { 
          label: 'Unknown', 
          variant: 'secondary' as const,
          icon: <HelpCircle className="w-3 h-3" />
        };
      case 0: 
        return { 
          label: 'No', 
          variant: 'destructive' as const,
          icon: <XCircle className="w-3 h-3" />
        };
      case 1: 
        return { 
          label: 'Yes', 
          variant: 'default' as const,
          icon: <CheckCircle2 className="w-3 h-3" />
        };
      default: 
        return { 
          label: 'Unknown', 
          variant: 'secondary' as const,
          icon: <HelpCircle className="w-3 h-3" />
        };
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Questionnaire Responses</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
          {questions.map((question, index) => {
            const answerInfo = getAnswerInfo(answers[question.key] || -1);
            return (
              <div key={question.key} className="flex items-start justify-between gap-2 sm:gap-3 p-2 rounded-lg bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    Q{index + 1}
                  </p>
                  <p className="text-xs sm:text-sm leading-tight">
                    {question.text}
                  </p>
                </div>
                <Badge variant={answerInfo.variant} className="flex items-center gap-1 shrink-0 text-xs">
                  {answerInfo.icon}
                  <span className="hidden sm:inline">{answerInfo.label}</span>
                  <span className="sm:hidden">{answerInfo.label.charAt(0)}</span>
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
