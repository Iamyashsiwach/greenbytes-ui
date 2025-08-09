/**
 * Status page to test backend connection via proxy
 */

import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

interface HealthResponse {
  ok: boolean;
  error?: string;
  details?: string;
}

const StatusPage: NextPage = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
      setLastCheck(new Date());
    } catch (error) {
      setHealth({
        ok: false,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      setLastCheck(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = () => {
    if (loading) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (health?.ok) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusText = () => {
    if (loading) return 'Checking...';
    if (health?.ok) return 'Backend Online';
    return 'Backend Offline';
  };

  return (
    <>
      <Head>
        <title>GreenBytes AI - Backend Status</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Backend Status</h1>
                <p className="text-gray-600 mt-2">GreenBytes AI Connection Monitor</p>
              </div>
              <button
                onClick={checkHealth}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Refresh'}
              </button>
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getStatusColor()} mb-6`}>
              <div className={`w-3 h-3 rounded-full ${
                loading ? 'bg-yellow-500 animate-pulse' :
                health?.ok ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">{getStatusText()}</span>
            </div>

            {/* Last Check Time */}
            {lastCheck && (
              <p className="text-sm text-gray-500 mb-6">
                Last checked: {lastCheck.toLocaleString()}
              </p>
            )}

            {/* Health Response */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Raw Response</h3>
              <pre className="bg-white p-4 rounded border text-sm overflow-auto">
                {JSON.stringify(health, null, 2)}
              </pre>
            </div>

            {/* Error Details */}
            {health?.error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-800 font-medium mb-2">Error Details</h3>
                <p className="text-red-700 text-sm">{health.details}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-blue-800 font-medium mb-2">Connection Info</h3>
              <div className="text-blue-700 text-sm space-y-1">
                <p>• Frontend proxy endpoint: <code>/api/health</code></p>
                <p>• Backend URL: <code>{process.env.NEXT_PUBLIC_BACKEND_URL || 'Server-side configured'}</code></p>
                <p>• This page tests the server-side proxy connection</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                ← Back to Main App
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusPage;
