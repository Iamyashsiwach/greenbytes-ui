/**
 * Modern composer component for mode selection, image upload, and Q&A form
 */

import React, { useState, useRef, ChangeEvent } from 'react';
import { Question, AnswerValue } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Image as ImageIcon, 
  Camera, 
  Zap, 
  HelpCircle,
  X,
  Check,
  FileImage,
  CheckCircle2,
  XCircle,
  TrendingUp
} from 'lucide-react';

interface ComposerProps {
  questions: Record<"disease" | "pest", Question[]>;
  onSubmit: (mode: "disease" | "pest", image: File, answers: Record<string, AnswerValue>) => void;
  disabled?: boolean;
}

export const Composer: React.FC<ComposerProps> = ({ questions, onSubmit, disabled = false }) => {
  const [mode, setMode] = useState<"disease" | "pest">("disease");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize answers when mode changes
  React.useEffect(() => {
    const newAnswers: Record<string, AnswerValue> = {};
    questions[mode].forEach(q => {
      newAnswers[q.key] = -1; // Default to Unknown
    });
    setAnswers(newAnswers);
  }, [mode, questions]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Please upload a JPEG or PNG image');
      return;
    }

    // Validate file size (8MB)
    if (file.size > 8 * 1024 * 1024) {
      alert('Image size must be less than 8MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
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

  const handleSubmit = () => {
    if (!imageFile) {
      alert('Please upload an image');
      return;
    }

    onSubmit(mode, imageFile, answers);

    // Reset form
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentQuestions = questions[mode];
  const answeredCount = Object.values(answers).filter(val => val !== -1).length;
  const progressPercentage = currentQuestions.length > 0 ? (answeredCount / currentQuestions.length) * 100 : 0;

  // Helper functions for visual feedback
  const getAnswerIcon = (questionKey: string) => {
    const value = answers[questionKey];
    if (value === undefined || value === -1) {
      return <HelpCircle className="w-3 h-3 text-gray-400" />;
    } else if (value === 1) {
      return <CheckCircle2 className="w-3 h-3 text-green-500" />;
    } else {
      return <XCircle className="w-3 h-3 text-red-500" />;
    }
  };

  const getQuestionCardClass = (questionKey: string) => {
    const value = answers[questionKey];
    if (value === undefined || value === -1) {
      return "border-gray-200 bg-white hover:border-primary/50";
    } else if (value === 1) {
      return "border-green-200 bg-green-50/50 shadow-sm";
    } else {
      return "border-red-200 bg-red-50/50 shadow-sm";
    }
  };

  return (
    <div className="bg-background border-t border-border shadow-lg">
      <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Mode Selection */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Analysis Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label 
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    mode === 'disease' 
                      ? 'border-primary bg-primary/10 shadow-sm' 
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !disabled && setMode('disease')}
                >
                  <input
                    type="radio"
                    value="disease"
                    checked={mode === 'disease'}
                    onChange={(e) => setMode(e.target.value as "disease")}
                    disabled={disabled}
                    className="sr-only"
                  />
                  <div className="text-2xl">🦠</div>
                  <div className="flex-1">
                    <p className="font-medium">Disease Detection</p>
                    <p className="text-xs text-muted-foreground">Dead Heart Analysis</p>
                  </div>
                  {mode === 'disease' && <Check className="w-4 h-4 text-primary" />}
                </Label>
                
                <Label 
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    mode === 'pest' 
                      ? 'border-primary bg-primary/10 shadow-sm' 
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !disabled && setMode('pest')}
                >
                  <input
                    type="radio"
                    value="pest"
                    checked={mode === 'pest'}
                    onChange={(e) => setMode(e.target.value as "pest")}
                    disabled={disabled}
                    className="sr-only"
                  />
                  <div className="text-2xl">🐛</div>
                  <div className="flex-1">
                    <p className="font-medium">Pest Detection</p>
                    <p className="text-xs text-muted-foreground">Early Shoot Borer</p>
                  </div>
                  {mode === 'pest' && <Check className="w-4 h-4 text-primary" />}
                </Label>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Sugarcane Image</Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
                    imageFile 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full max-h-24 sm:max-h-32 object-cover rounded-lg"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={disabled}
                        >
                          <Camera className="w-3 h-3 mr-1" />
                          Change
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          disabled={disabled}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FileImage className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload sugarcane image
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Select Image
                      </Button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                    disabled={disabled}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  JPEG or PNG, max 8MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4 sm:pb-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                      Diagnostic Questionnaire
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      Answer questions to improve analysis accuracy
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-2 rounded-full text-sm font-semibold shadow-sm">
                    {answeredCount}/{currentQuestions.length}
                    <span className="text-xs ml-1 opacity-75">answered</span>
                  </div>
                  {progressPercentage >= 60 && (
                    <Badge variant="default" className="text-xs bg-green-600 shadow-sm">
                      Ready
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-4 max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {currentQuestions.map((question, index) => (
                  <Card 
                    key={question.key} 
                    className={`transition-all duration-200 shadow-sm hover:shadow-md ${getQuestionCardClass(question.key)}`}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 pr-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                              {index + 1}
                            </span>
                          </div>
                          <Label className="text-sm font-medium leading-relaxed text-gray-800">
                            {question.text}
                          </Label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => handleAnswerChange(question.key, -1)}
                          disabled={disabled}
                          className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-sm font-medium min-h-[44px] ${
                            answers[question.key] === -1 || answers[question.key] === undefined
                              ? 'border-gray-400 bg-gray-50 text-gray-700 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span className="text-lg sm:hidden">❓</span>
                          <div className="hidden sm:flex items-center gap-2">
                            <HelpCircle className="w-4 h-4" />
                            <span>Unknown</span>
                          </div>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleAnswerChange(question.key, 0)}
                          disabled={disabled}
                          className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-sm font-medium min-h-[44px] ${
                            answers[question.key] === 0
                              ? 'border-red-400 bg-red-50 text-red-700 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:bg-red-50'
                          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span className="text-lg sm:hidden">❌</span>
                          <div className="hidden sm:flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            <span>No</span>
                          </div>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleAnswerChange(question.key, 1)}
                          disabled={disabled}
                          className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-sm font-medium min-h-[44px] ${
                            answers[question.key] === 1
                              ? 'border-green-400 bg-green-50 text-green-700 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-500 hover:border-green-300 hover:bg-green-50'
                          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span className="text-lg sm:hidden">✅</span>
                          <div className="hidden sm:flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Yes</span>
                          </div>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4 sm:mt-6 pt-4 border-t space-y-4">
                {/* Progress Indicator */}
                {answeredCount > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span>Progress</span>
                      </div>
                      <span className="font-medium">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={disabled || !imageFile}
                  size="lg"
                  className={`w-full h-12 text-base sm:text-sm transition-all duration-200 ${
                    !disabled && imageFile && answeredCount >= currentQuestions.length * 0.4
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                      : ''
                  }`}
                >
                  {disabled ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processing Analysis...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Run Analysis
                    </>
                  )}
                </Button>

                {/* Status indicators */}
                {!disabled && (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${imageFile ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={imageFile ? 'text-green-700' : 'text-red-600'}>
                        Image {imageFile ? 'Uploaded' : 'Required'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${answeredCount >= currentQuestions.length * 0.4 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className={answeredCount >= currentQuestions.length * 0.4 ? 'text-green-700' : 'text-gray-500'}>
                        Questions {answeredCount >= currentQuestions.length * 0.4 ? 'Sufficient' : 'More needed'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Ready indicator */}
                {!disabled && imageFile && answeredCount >= currentQuestions.length * 0.6 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Ready for comprehensive analysis! You've provided excellent diagnostic information.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
