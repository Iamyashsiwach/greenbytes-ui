/**
 * Server-side proxy for backend health check
 * Avoids CORS issues by proxying through Next.js API routes
 */

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${backendUrl}/health`);
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({ 
      error: 'Backend connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
