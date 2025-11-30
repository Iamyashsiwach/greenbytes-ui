/**
 * GreenBytes AI - Agricultural Intelligence Platform
 * Professional landing page with clean, trustworthy design
 */

import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Leaf, 
  Mic, 
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
  ArrowRight,
  Shield,
  Cpu,
  Camera,
  MessageSquare,
  Globe,
  Smartphone,
  BarChart3,
  Users,
  MapPin
} from 'lucide-react';

// Crop data - professional format
const CROPS = [
  { name: 'Sugarcane', status: 'live', accuracy: '97.5%', diseases: 2 },
  { name: 'Rice', status: 'development', eta: 'Q1 2025', diseases: 3 },
  { name: 'Wheat', status: 'development', eta: 'Q2 2025', diseases: 3 },
  { name: 'Cotton', status: 'development', eta: 'Q2 2025', diseases: 3 },
  { name: 'Maize', status: 'planned', eta: 'Q3 2025', diseases: 2 },
  { name: 'Groundnut', status: 'planned', eta: 'Q3 2025', diseases: 2 },
];

// Languages - professional format
const LANGUAGES = [
  { name: 'Hindi', native: 'हिंदी' },
  { name: 'Tamil', native: 'தமிழ்' },
  { name: 'Telugu', native: 'తెలుగు' },
  { name: 'Kannada', native: 'ಕನ್ನಡ' },
  { name: 'Marathi', native: 'मराठी' },
  { name: 'Gujarati', native: 'ગુજરાતી' },
  { name: 'Bengali', native: 'বাংলা' },
  { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

const Home: NextPage = () => {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        setApiOnline(response.ok);
      } catch {
        setApiOnline(false);
      }
    };
    checkHealth();
  }, []);

  return (
    <>
      <Head>
        <title>GreenBytes AI | Crop Disease Detection Platform</title>
        <meta name="description" content="AI-powered crop disease and pest detection for Indian agriculture. Accurate diagnosis using computer vision and diagnostic questionnaires." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">GreenBytes</span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  BETA
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
                  {apiOnline === true ? (
                    <>
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>System Online</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                      <span>Connecting...</span>
                    </>
                  )}
                </div>
                <Link href="/multimodal">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-sm h-9">
                    Open App
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm text-emerald-700 mb-6">
                <CheckCircle className="w-4 h-4" />
                <span>Sugarcane detection now available</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                Crop disease detection powered by AI
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl">
                Identify diseases and pests in your crops using your smartphone. 
                Combines image analysis with diagnostic questions for accurate results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/multimodal">
                  <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 h-12 px-6 text-base">
                    Start Diagnosis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto h-12 px-6 text-base border-gray-300"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  How it works
                </Button>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-16 pt-8 border-t border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">97.5%</div>
                  <div className="text-sm text-gray-500 mt-1">Detection accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">2</div>
                  <div className="text-sm text-gray-500 mt-1">Disease types covered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">15</div>
                  <div className="text-sm text-gray-500 mt-1">Diagnostic questions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">&lt;30s</div>
                  <div className="text-sm text-gray-500 mt-1">Analysis time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">How it works</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Our multimodal AI combines two approaches for reliable diagnosis
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <Camera className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Upload Image</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Take a photo of the affected plant. Our YOLO-based vision model analyzes visual symptoms.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Answer Questions</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Respond to 15 diagnostic questions about plant symptoms. TabNet model processes your answers.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Get Results</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Receive combined analysis with confidence scores and detection status within seconds.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Current capability */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-sm text-emerald-700 mb-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Available now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Sugarcane Analysis</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Early Shoot Borer</h3>
                      <p className="text-sm text-gray-500">Pest detection</p>
                    </div>
                    <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      97.5% accuracy
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Detects larval infestation in young sugarcane plants through visual and symptomatic analysis.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" />
                      YOLO + TabNet
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      15 questions
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Dead Heart</h3>
                      <p className="text-sm text-gray-500">Disease detection</p>
                    </div>
                    <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      92.5% accuracy
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Identifies dead heart syndrome caused by stem borer damage through symptom pattern recognition.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" />
                      YOLO + TabNet
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      15 questions
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Roadmap</h2>
            <p className="text-gray-600 mb-10 max-w-xl">
              Expanding coverage to major Indian crops with regional language support.
            </p>

            {/* Crops */}
            <div className="mb-12">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Crop Coverage</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {CROPS.map((crop) => (
                  <div 
                    key={crop.name}
                    className={`p-4 rounded-lg border text-center ${
                      crop.status === 'live' 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{crop.name}</div>
                    {crop.status === 'live' ? (
                      <div className="text-xs text-emerald-700 flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Live
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        {crop.eta}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mb-12">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Regional Languages</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {LANGUAGES.map((lang) => (
                  <div key={lang.name} className="p-3 rounded-lg border border-gray-200 bg-white text-center">
                    <div className="text-sm font-medium text-gray-900">{lang.name}</div>
                    <div className="text-xs text-gray-500">{lang.native}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Voice input support coming Q2 2025
              </p>
            </div>

            {/* Features coming */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Upcoming Features</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-white">
                  <Mic className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Voice Input</div>
                    <div className="text-xs text-gray-500">Answer questions by speaking</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-white">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Offline Mode</div>
                    <div className="text-xs text-gray-500">Works without internet</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-white">
                  <Smartphone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Mobile App</div>
                    <div className="text-xs text-gray-500">Native Android & iOS apps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Try it now
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start diagnosing your sugarcane crops today. Free during beta.
            </p>
            <Link href="/multimodal">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-base">
                Open Application
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-600 rounded-md flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-900">GreenBytes AI</span>
              </div>
              <div className="text-sm text-gray-500">
                Agricultural AI for Indian farmers
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
