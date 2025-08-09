/**
 * Simple test page to verify UI is working
 */

import React, { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

const SimplePage: NextPage = () => {
  const [mode, setMode] = useState<"disease" | "pest">("disease");

  return (
    <>
      <Head>
        <title>GreenBytes AI - Simple Test</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg sm:text-xl">🌱</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-green-800">GreenBytes AI</h1>
                <p className="text-sm sm:text-base text-green-600">Sugarcane Health Analysis</p>
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
                Welcome to GreenBytes AI
              </h2>
              <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6">
                Advanced multimodal analysis for sugarcane health detection
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 text-lg sm:text-xl">👁️</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">YOLO Vision</p>
                    <p className="text-xs text-gray-500">Image Analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <span className="text-purple-600 text-lg sm:text-xl">📊</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">TabNet</p>
                    <p className="text-xs text-gray-500">Tabular Data</p>
                  </div>
                </div>
              </div>
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
                  className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    mode === 'disease' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setMode('disease')}
                >
                  <input
                    type="radio"
                    value="disease"
                    checked={mode === 'disease'}
                    onChange={(e) => setMode(e.target.value as "disease")}
                    className="sr-only"
                  />
                  <span className="text-xl sm:text-2xl">🦠</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">Disease Detection</p>
                    <p className="text-xs text-gray-500">Dead Heart Analysis</p>
                  </div>
                  {mode === 'disease' && <span className="text-green-500">✓</span>}
                </label>
                
                <label 
                  className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    mode === 'pest' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setMode('pest')}
                >
                  <input
                    type="radio"
                    value="pest"
                    checked={mode === 'pest'}
                    onChange={(e) => setMode(e.target.value as "pest")}
                    className="sr-only"
                  />
                  <span className="text-xl sm:text-2xl">🐛</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">Pest Detection</p>
                    <p className="text-xs text-gray-500">Early Shoot Borer</p>
                  </div>
                  {mode === 'pest' && <span className="text-green-500">✓</span>}
                </label>
              </div>

              {/* Upload Section */}
              <div className="mt-4 sm:mt-6">
                <h4 className="font-medium mb-3 text-sm sm:text-base">Upload Image</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-green-400 transition-colors">
                  <span className="text-3xl sm:text-4xl mb-2 block">📷</span>
                  <p className="text-sm text-gray-600">Click to upload sugarcane image</p>
                  <p className="text-xs text-gray-400">JPEG or PNG, max 8MB</p>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                <span>❓</span>
                Questionnaire
                <span className="ml-auto bg-gray-100 px-2 py-1 rounded text-xs">0/10 answered</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4 max-h-80 sm:max-h-96 overflow-y-auto">
                {[1,2,3,4,5,6,7,8,9,10].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium mb-3">
                      <span className="text-green-600 font-bold">Q{i}.</span> Sample question about {mode === 'disease' ? 'disease symptoms' : 'pest indicators'}?
                    </p>
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`q${i}`} value="-1" className="text-green-600" />
                        Unknown
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`q${i}`} value="0" className="text-green-600" />
                        No
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`q${i}`} value="1" className="text-green-600" />
                        Yes
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 sm:mt-6 pt-4 border-t">
                <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 h-12 text-base sm:text-sm">
                  <span>⚡</span>
                  Run Analysis
                </button>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Ready - Backend Connected
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SimplePage;
