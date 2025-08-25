/**
 * Simple API client for multimodal analysis
 * Uses Next.js proxy routes to avoid CORS issues
 * Enhanced with request optimization and error recovery
 */

export interface PredictRequest {
  mode: 'pest' | 'disease';
  answers?: Record<string, number>;
  file?: File;
}

export interface PredictResponse {
  mode: string;
  used_image: boolean;
  yolo: {
    available: boolean;
    conf: number;
    label: number;
    bboxes: number[][];
  };
  tabnet: {
    conf: number;
    label: number;
    top_positive_keys: string[];
  };
  fusion: {
    detected: boolean;
    reason: string;
    thresholds: {
      yolo: number;
      tabnet: number;
    };
  };
  trace: {
    rules: string[];
    numbers: {
      yolo_conf: number | null;
      tabnet_conf: number | null;
      yes_count: number;
      no_count: number;
    };
  };
  ref_img: string;
}

/**
 * Get API base URL from environment
 */
function getApiBaseUrl(): string {
  // Use environment variable or fall back to proxy for HTTPS compatibility
  return process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ ok: boolean }> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/health`);
  
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Make prediction request
 */
export async function predict({ mode, answers, file }: PredictRequest): Promise<PredictResponse> {
  const baseUrl = getApiBaseUrl();
  
  if (file) {
    // Multipart request (image-only or combined)
    const formData = new FormData();
    formData.append('mode', mode);
    if (answers) {
      formData.append('answers', JSON.stringify(answers));
    }
    formData.append('file', file);
    
    const response = await fetch(`${baseUrl}/predict`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || errorData.detail || `API error ${response.status}`);
    }
    
    const result = await response.json();
    
    // Add reference image based on mode (since Azure backend doesn't include this)
    if (mode === 'disease') {
      result.ref_img = 'deadheart_01.jpg';
    } else if (mode === 'pest') {
      result.ref_img = 'esb_01.jpg';
    }
    
    return result;
    
  } else if (answers) {
    // JSON request (answers-only)
    const response = await fetch(`${baseUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mode, answers }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || errorData.detail || `API error ${response.status}`);
    }
    
    const result = await response.json();
    
    // Add reference image based on mode (since Azure backend doesn't include this)
    if (mode === 'disease') {
      result.ref_img = 'deadheart_01.jpg';
    } else if (mode === 'pest') {
      result.ref_img = 'esb_01.jpg';
    }
    
    return result;
    
  } else {
    throw new Error('Must provide either file or answers');
  }
}
