/**
 * Modern composer component for mode selection, image upload, and Q&A form
 */

import React, { useState, useRef, ChangeEvent } from 'react';
import { Question, AnswerValue } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Image as ImageIcon, 
  Camera, 
  Zap, 
  HelpCircle,
  X,
  Check,
  FileImage
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
                  className={`flex items-center gap-3 p-4 sm:p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    mode === 'disease' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
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
                  className={`flex items-center gap-3 p-4 sm:p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    mode === 'pest' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
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
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Questionnaire
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {answeredCount}/10 answered
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {currentQuestions.map((question, index) => (
                  <Card key={question.key} className="question-card">
                    <CardContent className="p-3 sm:p-4">
                      <Label className="text-sm font-medium leading-tight mb-3 block">
                        <span className="text-primary font-bold">Q{index + 1}.</span> {question.text}
                      </Label>
                      
                      <RadioGroup
                        value={answers[question.key]?.toString() || "-1"}
                        onValueChange={(value) => handleAnswerChange(question.key, parseInt(value) as AnswerValue)}
                        disabled={disabled}
                        className="flex flex-wrap gap-3 sm:gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="-1" id={`${question.key}-unknown`} />
                          <Label htmlFor={`${question.key}-unknown`} className="text-xs cursor-pointer">
                            Unknown
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id={`${question.key}-no`} />
                          <Label htmlFor={`${question.key}-no`} className="text-xs cursor-pointer">
                            No
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id={`${question.key}-yes`} />
                          <Label htmlFor={`${question.key}-yes`} className="text-xs cursor-pointer">
                            Yes
                          </Label>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4 sm:mt-6 pt-4 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={disabled || !imageFile}
                  size="lg"
                  className="w-full h-12 text-base sm:text-sm"
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
