/**
 * Simple test page to verify UI is working
 */

import React, { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { CheckCircle2, HelpCircle, XCircle, TrendingUp, Leaf, Eye, Brain, Zap, ArrowRight } from 'lucide-react';

const SimplePage: NextPage = () => {
  const [mode, setMode] = useState<"disease" | "pest">("disease");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Sample questions grouped by category
  const questionGroups = {
    disease: [
      {
        category: "Plant Appearance",
        questions: [
          { id: "Q1", text: "Is the stem yellow or brown in color?" },
          { id: "Q2", text: "Is the stem dried?" },
          { id: "Q3", text: "Does the plant look weak or wilted?" },
          { id: "Q4", text: "Are the leaves yellowing?" },
          { id: "Q5", text: "Are the leaves drying from the tip downwards?" },
        ]
      },
      {
        category: "Physical Symptoms",
        questions: [
          { id: "Q6", text: "Does the plant smell rotten or decayed?" },
          { id: "Q7", text: "Can the plant be easily pulled out of the ground?" },
          { id: "Q8", text: "Is the inside of the stem hollow?" },
          { id: "Q9", text: "Do you see a hole near the root or lower stem?" },
          { id: "Q10", text: "Is there a single dead central shoot among green leaves?" },
        ]
      },
      {
        category: "Growth & Development",
        questions: [
          { id: "Q11", text: "Is the plant younger than 120 days?" },
          { id: "Q12", text: "Has the plant stopped growing taller?" },
          { id: "Q13", text: "Do you notice any powdery waste (frass) near the base?" },
          { id: "Q14", text: "Has the plant fallen over easily without strong wind?" },
          { id: "Q15", text: "Do the new shoots fail to grow properly?" },
        ]
      }
    ],
    pest: [
      {
        category: "Larva Identification",
        questions: [
          { id: "Q1", text: "Is the larva body dirty white?" },
          { id: "Q2", text: "Does the larva have about five dark violet stripes along its body?" },
          { id: "Q3", text: "Is the larva's head dark brown?" },
          { id: "Q4", text: "Do you find the larva inside the stem when you split it?" },
          { id: "Q5", text: "Are the damaged plants scattered across the field?" },
        ]
      },
      {
        category: "Plant Damage",
        questions: [
          { id: "Q6", text: "Do you see a hole near the root or lower stem?" },
          { id: "Q7", text: "Is there frass (sawdust-like waste) near the holes?" },
          { id: "Q8", text: "Is the stem hollow inside?" },
          { id: "Q9", text: "Are the central leaves drying up?" },
          { id: "Q10", text: "Do you see small cuts on the leaves?" },
        ]
      },
      {
        category: "Field Conditions",
        questions: [
          { id: "Q11", text: "Is the plant younger than 120 days?" },
          { id: "Q12", text: "Can the plant be easily pulled out of the soil?" },
          { id: "Q13", text: "Is the top shoot dead but the lower leaves are green?" },
          { id: "Q14", text: "Are nearby plants showing the same damage?" },
          { id: "Q15", text: "Is the growth of the plant slowed compared to healthy plants?" },
        ]
      }
    ]
  };

  const currentGroups = questionGroups[mode];
  const totalQuestions = currentGroups.reduce((sum, group) => sum + group.questions.length, 0);
  // Optimized answer counting for better performance
  const answeredCount = Object.values(answers).filter(val => val !== -1).length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getAnswerIcon = (questionId: string) => {
    const value = answers[questionId];
    if (value === undefined || value === -1) {
      return <HelpCircle className="w-4 h-4 text-gray-400" />;
    } else if (value === 1) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getAnswerColor = (questionId: string) => {
    const value = answers[questionId];
    if (value === undefined || value === -1) {
      return "border-gray-200 bg-white";
    } else if (value === 1) {
      return "border-green-200 bg-green-50/50";
    } else {
      return "border-red-200 bg-red-50/50";
    }
  };

  return (
    <>
      <Head>
        <title>Quick Test | GreenBytes AI</title>
        <meta name="description" content="Quick diagnostic test for sugarcane disease and pest detection" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">GreenBytes</h1>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">BETA</span>
                </div>
                <p className="text-sm text-gray-600">Sugarcane Diagnosis</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Welcome Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 max-w-2xl mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-green-600 text-xl sm:text-2xl">🧠</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Crop Diagnosis
              </h2>
              <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6">
                AI-powered disease and pest detection for sugarcane
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg transition-all duration-200 hover:bg-blue-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">YOLO Vision</p>
                    <p className="text-xs text-gray-500">Image Analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-purple-50 rounded-lg transition-all duration-200 hover:bg-purple-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">TabNet Analysis</p>
                    <p className="text-xs text-gray-500">Symptom Classification</p>
                  </div>
                </div>
              </div>
              
              {/* Progress Indicator */}
              {answeredCount > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Analysis Progress</span>
                    </div>
                    <span className="text-sm text-green-700">{answeredCount}/{totalQuestions}</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    {progressPercentage >= 80 ? "Almost ready for analysis!" : 
                     progressPercentage >= 50 ? "Great progress!" : 
                     "Keep going to get accurate results"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Mode Selection */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                <span>⚡</span>
                Analysis Mode
              </h3>
              <div className="space-y-3">
                <label 
                  className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                    mode === 'disease' 
                      ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                  }`}
                  onClick={() => {
                    setMode('disease');
                    setAnswers({}); // Reset answers when mode changes
                  }}
                >
                  <input
                    type="radio"
                    value="disease"
                    checked={mode === 'disease'}
                    onChange={(e) => {
                      setMode(e.target.value as "disease");
                      setAnswers({});
                    }}
                    className="sr-only"
                  />
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🦠</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">Disease Detection</p>
                    <p className="text-xs text-gray-500">Dead Heart Analysis</p>
                  </div>
                  {mode === 'disease' && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </label>
                
                <label 
                  className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                    mode === 'pest' 
                      ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                  }`}
                  onClick={() => {
                    setMode('pest');
                    setAnswers({}); // Reset answers when mode changes
                  }}
                >
                  <input
                    type="radio"
                    value="pest"
                    checked={mode === 'pest'}
                    onChange={(e) => {
                      setMode(e.target.value as "pest");
                      setAnswers({});
                    }}
                    className="sr-only"
                  />
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🐛</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">Pest Detection</p>
                    <p className="text-xs text-gray-500">Early Shoot Borer</p>
                  </div>
                  {mode === 'pest' && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </label>
              </div>

              {/* Upload Section */}
              <div className="mt-4 sm:mt-6">
                <h4 className="font-medium mb-3 text-sm sm:text-base flex items-center gap-2">
                  <span className="text-blue-600">📷</span>
                  Upload Image
                </h4>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all duration-200 cursor-pointer ${
                    selectedImage 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'
                  }`}
                  onClick={() => setSelectedImage(selectedImage ? null : 'mock-image')}
                >
                  {selectedImage ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-sm text-green-700 font-medium">Image uploaded successfully!</p>
                      <p className="text-xs text-green-600">sugarcane_sample.jpg</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                  <span className="text-3xl sm:text-4xl mb-2 block">📷</span>
                  <p className="text-sm text-gray-600">Click to upload sugarcane image</p>
                  <p className="text-xs text-gray-400">JPEG or PNG, max 8MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-lg">📋</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      Diagnostic Questionnaire
              </h3>
                    <p className="text-xs text-gray-500">
                      {mode === 'disease' ? 'Dead Heart Disease Analysis' : 'Early Shoot Borer Detection'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                    {answeredCount}/{totalQuestions}
                    <span className="text-xs ml-1 opacity-75">answered</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 max-h-80 sm:max-h-96 overflow-y-auto pr-2">
                {currentGroups.map((group, groupIndex) => (
                  <div key={group.category} className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        group.questions.every(q => answers[q.id] !== undefined && answers[q.id] !== -1)
                          ? 'bg-green-100 text-green-700'
                          : group.questions.some(q => answers[q.id] !== undefined && answers[q.id] !== -1)
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {groupIndex + 1}
                      </div>
                      <h4 className="font-semibold text-sm text-gray-800">{group.category}</h4>
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-xs text-gray-500">
                        {group.questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== -1).length}/{group.questions.length}
                      </span>
                    </div>
                    
                    <div className="space-y-4 ml-8">
                      {group.questions.map((question) => (
                        <div 
                          key={question.id} 
                          className={`border rounded-xl p-4 sm:p-5 transition-all duration-200 shadow-sm hover:shadow-md ${getAnswerColor(question.id)}`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 pr-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full">
                                  {question.id.replace('Q', '')}
                                </span>
                                <div className="flex-shrink-0">
                                  {getAnswerIcon(question.id)}
                                </div>
                              </div>
                              <p className="text-sm font-medium leading-relaxed text-gray-800">
                                {question.text}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            <button
                              type="button"
                              onClick={() => handleAnswerChange(question.id, -1)}
                              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                                answers[question.id] === -1 || answers[question.id] === undefined
                                  ? 'border-gray-400 bg-gray-50 text-gray-700 shadow-sm'
                                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <HelpCircle className="w-4 h-4" />
                              <span className="hidden sm:inline">Unknown</span>
                              <span className="sm:hidden">?</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleAnswerChange(question.id, 0)}
                              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                                answers[question.id] === 0
                                  ? 'border-red-400 bg-red-50 text-red-700 shadow-sm'
                                  : 'border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:bg-red-50'
                              }`}
                            >
                              <XCircle className="w-4 h-4" />
                              <span className="hidden sm:inline">No</span>
                              <span className="sm:hidden">✗</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleAnswerChange(question.id, 1)}
                              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                                answers[question.id] === 1
                                  ? 'border-green-400 bg-green-50 text-green-700 shadow-sm'
                                  : 'border-gray-200 bg-white text-gray-500 hover:border-green-300 hover:bg-green-50'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Yes</span>
                              <span className="sm:hidden">✓</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-4">
                  {/* Progress Summary */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Completion Progress</span>
                      <span className="text-sm font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{answeredCount} of {totalQuestions} questions answered</span>
                      <span>{Math.ceil(totalQuestions * 0.6)} needed for analysis</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 h-14 text-base ${
                        answeredCount >= totalQuestions * 0.6
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-dashed border-gray-300'
                      }`}
                      disabled={answeredCount < totalQuestions * 0.6}
                    >
                      <Zap className="w-5 h-5" />
                      <span>
                        {answeredCount < totalQuestions * 0.6 
                          ? `Answer ${Math.ceil(totalQuestions * 0.6) - answeredCount} more questions`
                          : 'Run AI Analysis'
                        }
                      </span>
                    </button>
                    {answeredCount > 0 && (
                      <button 
                        className="px-6 py-4 text-gray-600 hover:text-gray-800 text-sm transition-colors border border-gray-300 rounded-xl hover:bg-gray-50"
                        onClick={() => setAnswers({})}
                      >
                        Clear All
                </button>
                    )}
                  </div>
                  
                  {/* Success Message */}
                  {answeredCount >= totalQuestions * 0.6 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-800">Ready for Analysis!</p>
                          <p className="text-xs text-green-600">You've provided sufficient information for accurate AI-powered diagnosis.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Status */}
          <div className="mt-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-medium">AI System Ready</span>
              <div className="text-xs bg-green-200 px-2 py-1 rounded-full ml-2">
                99.75% Accuracy
              </div>
            </div>
            
            {progressPercentage > 0 && (
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-4 border">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Questionnaire Progress</span>
                    <span className="font-medium text-green-700">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {answeredCount} of {totalQuestions} diagnostic questions completed
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default SimplePage;
