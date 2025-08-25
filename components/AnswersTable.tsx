/**
 * Component to display the 10 Q&A in a modern card format
 */

import React from 'react';
import { Question, AnswerValue } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, HelpCircle, BarChart3, TrendingUp } from 'lucide-react';

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
          icon: <HelpCircle className="w-3 h-3 text-gray-400" />,
          bgColor: 'bg-gray-50/50',
          borderColor: 'border-gray-200'
        };
      case 0: 
        return { 
          label: 'No', 
          variant: 'destructive' as const,
          icon: <XCircle className="w-3 h-3 text-red-500" />,
          bgColor: 'bg-red-50/50',
          borderColor: 'border-red-200'
        };
      case 1: 
        return { 
          label: 'Yes', 
          variant: 'default' as const,
          icon: <CheckCircle2 className="w-3 h-3 text-green-500" />,
          bgColor: 'bg-green-50/50',
          borderColor: 'border-green-200'
        };
      default: 
        return { 
          label: 'Unknown', 
          variant: 'secondary' as const,
          icon: <HelpCircle className="w-3 h-3 text-gray-400" />,
          bgColor: 'bg-gray-50/50',
          borderColor: 'border-gray-200'
        };
    }
  };

  // Calculate statistics
  const totalAnswered = Object.values(answers).filter(val => val !== -1).length;
  const yesCount = Object.values(answers).filter(val => val === 1).length;
  const noCount = Object.values(answers).filter(val => val === 0).length;
  const unknownCount = questions.length - totalAnswered;
  const completionPercentage = (totalAnswered / questions.length) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Diagnostic Summary
          </CardTitle>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-xs font-medium text-green-700">{Math.round(completionPercentage)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        {/* Statistics Summary */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span className="text-xs font-bold text-green-700">{yesCount}</span>
            </div>
            <p className="text-xs text-green-600">Yes</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <XCircle className="w-3 h-3 text-red-500" />
              <span className="text-xs font-bold text-red-700">{noCount}</span>
            </div>
            <p className="text-xs text-red-600">No</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <HelpCircle className="w-3 h-3 text-gray-400" />
              <span className="text-xs font-bold text-gray-700">{unknownCount}</span>
            </div>
            <p className="text-xs text-gray-600">Unknown</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Completion Progress</span>
            <span className="font-medium">{totalAnswered}/{questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto custom-scrollbar">
          {questions.map((question, index) => {
            const answerInfo = getAnswerInfo(answers[question.key] || -1);
            return (
              <div 
                key={question.key} 
                className={`flex items-start justify-between gap-2 sm:gap-3 p-2 rounded-lg border transition-all duration-200 ${answerInfo.bgColor} ${answerInfo.borderColor}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-bold text-primary">Q{index + 1}</span>
                    {answerInfo.icon}
                  </div>
                  <p className="text-xs sm:text-sm leading-tight text-gray-700">
                    {question.text}
                  </p>
                </div>
                <Badge variant={answerInfo.variant} className="flex items-center gap-1 shrink-0 text-xs">
                  <span className="hidden sm:inline">{answerInfo.label}</span>
                  <span className="sm:hidden">{answerInfo.label.charAt(0)}</span>
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Analysis Readiness Indicator */}
        {totalAnswered >= questions.length * 0.6 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-800 flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              Sufficient data collected for reliable analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
