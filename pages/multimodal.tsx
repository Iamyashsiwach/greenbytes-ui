/**
 * Multimodal Analysis Page - MVP Interface
 * Supports answers-only, image-only, and combined analysis modes
 */

import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Question, AnswerValue } from '../lib/types';
import { predict, checkHealth } from '../lib/api-client';
import type { PredictResponse } from '../lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Leaf, 
  Upload, 
  Zap, 
  HelpCircle, 
  Check, 
  X,
  Eye,
  Brain,
  AlertTriangle,
  CheckCircle,
  Activity,
  Wifi,
  WifiOff,
  CheckCircle2,
  XCircle,
  TrendingUp
} from 'lucide-react';
import diseaseQuestions from '../public/data/disease_questions.json';
import esbQuestions from '../public/data/esb_questions.json';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  payload: any;
}

const MultimodalPage: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  
  // Form state
  const [mode, setMode] = useState<'disease' | 'pest'>('disease');
  const [includeImage, setIncludeImage] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  
  const questions = {
    disease: diseaseQuestions as Question[],
    pest: esbQuestions as Question[]
  };

  // Initialize answers when mode changes
  useEffect(() => {
    const newAnswers: Record<string, AnswerValue> = {};
    questions[mode].forEach(q => {
      newAnswers[q.key] = -1; // Default to Unknown
    });
    setAnswers(newAnswers);
  }, [mode]);

  // Check API health on mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await checkHealth();
        setApiOnline(true);
      } catch {
        setApiOnline(false);
      }
    };
    checkApiHealth();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Please upload a JPEG or PNG image');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Image size must be less than 8MB');
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnswerChange = (questionKey: string, value: AnswerValue) => {
    setAnswers(prev => ({
      ...prev,
      [questionKey]: value
    }));
  };

  const handleSubmit = async () => {
    if (includeImage && !imageFile) {
      alert('Please upload an image or disable image mode');
      return;
    }

    // Determine submission mode
    let submissionMode: string;
    let submissionData: { mode: 'disease' | 'pest'; answers?: Record<string, AnswerValue>; file?: File } = { mode };
    
    if (includeImage && imageFile) {
      submissionData.file = imageFile;
      submissionMode = 'combined';
    } else {
      submissionMode = 'answers_only';
    }
    
    submissionData.answers = answers;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      payload: {
        mode,
        submissionMode,
        imagePreview: includeImage ? imagePreview : null,
        answers
      }
    };
    setMessages(prev => [...prev, userMessage]);

    // Add loading message
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      payload: { status: `Running ${submissionMode} analysis...` }
    };
    setMessages(prev => [...prev, loadingMessage]);
    setIsLoading(true);

    try {
      const response = await predict(submissionData);
      
      // Replace loading message with result
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id
            ? { ...loadingMessage, payload: response }
            : msg
        )
      );
    } catch (error) {
      // Replace loading message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id
            ? { 
                ...loadingMessage, 
                payload: { 
                  status: 'Analysis failed',
                  error: error instanceof Error ? error.message : 'Connection error'
                }
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      // Reset form
      if (includeImage) {
        setImageFile(null);
        setImagePreview('');
      }
    }
  };

  const currentQuestions = questions[mode];
  const answeredCount = Object.values(answers).filter(val => val !== -1).length;
  const progressPercentage = currentQuestions.length > 0 ? (answeredCount / currentQuestions.length) * 100 : 0;

  // Helper functions for visual feedback
  const getAnswerIcon = (questionKey: string) => {
    const value = answers[questionKey];
    if (value === undefined || value === -1) {
      return <HelpCircle className="w-4 h-4 text-gray-400" />;
    } else if (value === 1) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getQuestionCardClass = (questionKey: string) => {
    const value = answers[questionKey];
    if (value === undefined || value === -1) {
      return "border-gray-200 bg-white hover:border-green-300";
    } else if (value === 1) {
      return "border-green-200 bg-green-50/50 shadow-sm";
    } else {
      return "border-red-200 bg-red-50/50 shadow-sm";
    }
  };

  return (
    <>
      <Head>
        <title>GreenBytes AI - Multimodal Analysis</title>
        <meta name="description" content="Multimodal sugarcane health analysis" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-green-800">GreenBytes AI</h1>
                  <p className="text-xs text-green-600 hidden sm:block">Multimodal Analysis</p>
                </div>
                <Badge variant="secondary" className="hidden md:flex items-center gap-1 text-xs">
                  <Activity className="w-3 h-3" />
                  MVP
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <Badge variant={apiOnline === true ? "default" : "destructive"} className="text-xs flex items-center gap-1">
                  {apiOnline === true ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  <span className="hidden sm:inline">{apiOnline === true ? 'API Online' : 'API Offline'}</span>
                  <span className="sm:hidden">{apiOnline === true ? 'Online' : 'Offline'}</span>
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
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              
              {/* Welcome Message */}
              {messages.length === 0 && (
                <Card className="text-center p-4 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <div className="space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-green-800">GreenBytes AI</h2>
                    <p className="text-sm sm:text-base text-green-700">Multimodal sugarcane health analysis</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <div className="p-3 sm:p-4 bg-white/60 rounded-lg">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg sm:text-xl">📋</span>
                        </div>
                        <p className="font-medium text-sm">Answers Only</p>
                        <p className="text-xs text-muted-foreground">TabNet Analysis</p>
                      </div>
                      <div className="p-3 sm:p-4 bg-white/60 rounded-lg">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg sm:text-xl">📷</span>
                        </div>
                        <p className="font-medium text-sm">Image Only</p>
                        <p className="text-xs text-muted-foreground">YOLO Vision</p>
                      </div>
                      <div className="p-3 sm:p-4 bg-white/60 rounded-lg">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg sm:text-xl">⚡</span>
                        </div>
                        <p className="font-medium text-sm">Combined</p>
                        <p className="text-xs text-muted-foreground">Fusion Logic</p>
                      </div>
                    </div>
                    
                    {/* Progress Indicator when questions are answered */}
                    {answeredCount > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Analysis Progress</span>
                          </div>
                          <span className="text-sm text-green-700">{answeredCount}/{currentQuestions.length}</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                          {progressPercentage >= 80 ? "Ready for comprehensive analysis!" : 
                           progressPercentage >= 50 ? "Great progress - keep going!" : 
                           "Answer more questions for better accuracy"}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Messages */}
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} questions={currentQuestions} />
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div className="border-t bg-white p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                
                {/* Mode & Image */}
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-sm">Analysis Setup</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Mode Selection */}
                    <div>
                      <Label className="text-xs font-medium mb-2 block">Mode</Label>
                      <div className="space-y-2">
                        {(['disease', 'pest'] as const).map((m) => (
                          <Label 
                            key={m}
                            className={`flex items-center gap-3 p-4 sm:p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                              mode === m 
                                ? 'border-primary bg-gradient-to-r from-green-50 to-emerald-50 shadow-md' 
                                : 'border-border hover:border-primary/50 hover:bg-primary/5'
                            }`}
                            onClick={() => setMode(m)}
                          >
                            <input
                              type="radio"
                              checked={mode === m}
                              onChange={() => setMode(m)}
                              className="sr-only"
                            />
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              m === 'disease' ? 'bg-red-100' : 'bg-orange-100'
                            }`}>
                              <span className="text-2xl">{m === 'disease' ? '🦠' : '🐛'}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {m === 'disease' ? 'Disease Detection' : 'Pest Detection'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {m === 'disease' ? 'Dead Heart Analysis' : 'Early Shoot Borer'}
                              </p>
                            </div>
                            {mode === m && (
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </Label>
                        ))}
                      </div>
                    </div>

                    {/* Include Image Toggle */}
                    <div>
                      <Label className="flex items-center gap-2 cursor-pointer p-2">
                        <input
                          type="checkbox"
                          checked={includeImage}
                          onChange={(e) => setIncludeImage(e.target.checked)}
                          className="rounded w-4 h-4"
                        />
                        <span className="text-sm">Include Image Analysis</span>
                      </Label>
                    </div>

                    {/* Image Upload */}
                    {includeImage && (
                      <div>
                        <Label className="text-xs font-medium mb-2 block">Upload Image</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          {imagePreview ? (
                            <div className="space-y-2">
                              <img src={imagePreview} alt="Preview" className="w-full max-h-32 object-cover rounded" />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setImageFile(null);
                                  setImagePreview('');
                                }}
                              >
                                <X className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Click to upload</p>
                              <Button variant="outline" size="sm" onClick={() => document.getElementById('file-input')?.click()}>
                                Select Image
                              </Button>
                              <input
                                id="file-input"
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Questions */}
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Questionnaire</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {answeredCount}/{currentQuestions.length} answered
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                      {currentQuestions.map((question, index) => (
                        <Card 
                          key={question.key} 
                          className={`p-3 transition-all duration-200 ${getQuestionCardClass(question.key)}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Label className="text-xs font-medium leading-tight flex-1 pr-2">
                              <span className="text-primary font-bold">Q{index + 1}.</span> {question.text}
                            </Label>
                            <div className="flex-shrink-0">
                              {getAnswerIcon(question.key)}
                            </div>
                          </div>
                          <RadioGroup
                            value={answers[question.key]?.toString() || "-1"}
                            onValueChange={(value) => handleAnswerChange(question.key, parseInt(value) as AnswerValue)}
                            className="flex flex-wrap gap-3 sm:gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="-1" id={`${question.key}-unknown`} />
                              <Label htmlFor={`${question.key}-unknown`} className="text-xs cursor-pointer flex items-center gap-1">
                                <HelpCircle className="w-3 h-3 text-gray-400" />
                                Unknown
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="0" id={`${question.key}-no`} />
                              <Label htmlFor={`${question.key}-no`} className="text-xs cursor-pointer flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-red-500" />
                                No
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="1" id={`${question.key}-yes`} />
                              <Label htmlFor={`${question.key}-yes`} className="text-xs cursor-pointer flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                Yes
                              </Label>
                            </div>
                          </RadioGroup>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="space-y-3">
                        <Button
                          onClick={handleSubmit}
                          disabled={isLoading || (includeImage && !imageFile)}
                          className={`w-full h-12 text-base sm:text-sm transition-all duration-200 ${
                            !isLoading && (!includeImage || imageFile) && answeredCount >= currentQuestions.length * 0.4
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                              : ''
                          }`}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          {isLoading ? 'Processing...' : 'Run Analysis'}
                        </Button>
                        
                        {/* Progress and status indicators */}
                        {!isLoading && (
                          <div className="space-y-2">
                            {/* Questionnaire progress */}
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Questionnaire Progress</span>
                              <span className="font-medium">{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            
                            {/* Status indicators */}
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${includeImage && imageFile ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className={includeImage && imageFile ? 'text-green-700' : 'text-gray-500'}>
                                  Image {includeImage ? (imageFile ? 'Ready' : 'Required') : 'Optional'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${answeredCount >= currentQuestions.length * 0.4 ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className={answeredCount >= currentQuestions.length * 0.4 ? 'text-green-700' : 'text-gray-500'}>
                                  Questions {answeredCount >= currentQuestions.length * 0.4 ? 'Sufficient' : 'Needed'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{ message: Message; questions: Question[] }> = ({ message, questions }) => {
  if (message.role === 'user') {
    const { mode, submissionMode, imagePreview, answers } = message.payload;
    
    return (
      <div className="flex justify-end">
        <Card className="max-w-sm sm:max-w-md lg:max-w-2xl bg-primary text-primary-foreground">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {mode === 'disease' ? '🦠 Disease' : '🐛 Pest'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {submissionMode.replace(/_/g, ' ')}
              </Badge>
            </div>
            
            {imagePreview && (
              <img src={imagePreview} alt="Uploaded" className="w-full max-h-24 sm:max-h-32 object-cover rounded mb-3" />
            )}
            
            <p className="text-sm">
              Analysis request submitted ({submissionMode.replace(/_/g, ' ')} mode)
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assistant message
  const payload = message.payload;

  if ('status' in payload) {
    return (
      <div className="flex justify-start">
        <Card className="max-w-sm sm:max-w-md lg:max-w-2xl w-full">
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-muted-foreground">{payload.status}</p>
            {payload.error && (
              <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded">
                <p className="text-destructive text-sm">{payload.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Analysis result
  const result = payload as PredictResponse;

  return (
    <div className="flex justify-start">
      <Card className="max-w-full w-full">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="space-y-4">
            
            {/* Analysis Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* YOLO Results */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    <span className="hidden sm:inline">YOLO Vision</span>
                    <span className="sm:hidden">YOLO</span>
                    <Badge variant={result.yolo.available ? "default" : "secondary"} className="ml-auto text-xs">
                      {result.yolo.available ? "Active" : "N/A"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center">
                    <p className="text-lg sm:text-2xl font-bold text-blue-600">
                      {result.used_image ? `${(result.yolo.conf * 100).toFixed(1)}%` : "No Image"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {result.used_image ? "Confidence" : "Image not provided"}
                    </p>
                    {result.yolo.label === 1 && (
                      <Badge variant="default" className="mt-2">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Detected
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* TabNet Results */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                    <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                    <span className="hidden sm:inline">TabNet Analysis</span>
                    <span className="sm:hidden">TabNet</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center">
                    <p className="text-lg sm:text-2xl font-bold text-purple-600">
                      {(result.tabnet.conf * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Score (≥{(result.fusion.thresholds.tabnet * 100).toFixed(0)}% threshold)
                    </p>
                    {result.tabnet.label === 1 && (
                      <Badge variant="default" className="mt-2">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Detected
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Final Verdict */}
            <Card className={`border-2 ${result.fusion.detected ? 'border-destructive/20 bg-destructive/5' : 'border-green-200 bg-green-50'}`}>
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {result.fusion.detected ? (
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                  ) : (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  )}
                  <span className={`text-sm sm:text-lg font-bold ${result.fusion.detected ? 'text-destructive' : 'text-green-600'}`}>
                    {result.fusion.detected ? 'TARGET DETECTED' : 'NOT DETECTED'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Analysis mode: {result.fusion.reason.replace(/_/g, ' ')}
                </p>
              </CardContent>
            </Card>

            {/* Reference Image */}
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                  <span className="text-orange-600">🔍</span>
                  Reference Image
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <img 
                  src={result.reference_image_url} 
                  alt="Reference" 
                  className="w-full max-h-24 sm:max-h-32 object-contain rounded bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.svg';
                  }}
                />
                <p className="text-center text-xs sm:text-sm text-orange-800 mt-2">
                  {result.mode === 'disease' ? 'Dead Heart Disease' : 'Early Shoot Borer (ESB)'}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultimodalPage;
