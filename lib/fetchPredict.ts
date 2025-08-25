/**
 * Helper function to call backend prediction API via proxy
 * Uses Next.js API routes to avoid CORS issues
 * Enhanced with error handling and request optimization
 */

import axios from 'axios';
import { PredictResponse, AnswerValue } from './types';

export async function fetchPredict(
  image: File,
  mode: "disease" | "pest",
  answers: AnswerValue[]
): Promise<PredictResponse> {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('mode', mode);
  formData.append('answers', JSON.stringify(answers));

  try {
    const response = await axios.post<PredictResponse>(
      '/api/predict', // Use proxy route instead of direct backend call
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error
        throw new Error(error.response.data.error || error.response.data.detail || 'Prediction failed');
      } else if (error.request) {
        // Request made but no response
        throw new Error('Unable to connect to server');
      }
    }
    throw new Error('An unexpected error occurred');
  }
}
