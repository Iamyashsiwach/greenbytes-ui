/**
 * Server-side proxy for backend prediction endpoint
 * Forwards multipart form data to backend and returns response
 */

// AI prediction API endpoint with optimized file handling
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';

// Disable default body parser to handle both JSON and multipart data manually
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const backendUrl = process.env.BACKEND_ORIGIN || 'http://20.193.136.83:8000';

  try {
    // Check if this is a JSON request (answers-only) or multipart (with image)
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      // Handle answers-only mode (JSON request)
      // Parse JSON body manually since bodyParser is disabled
      const bodyBuffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
      });
      
      const body = JSON.parse(bodyBuffer.toString());
      const { mode, answers } = body;
      
      if (!mode || !answers) {
        return res.status(400).json({ 
          error: 'Missing required fields: mode and answers are required for answers-only mode' 
        });
      }

      // Forward JSON request to backend
      const response = await axios.post(`${backendUrl}/predict`, {
        mode,
        answers
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
        validateStatus: () => true, // Don't throw on HTTP error status
      });

      // Add appropriate reference image URL based on mode and detection
      if (response.status === 200 && response.data) {
        const responseData = response.data;
        
        // Add reference image filename based on analysis mode
        if (mode === 'disease') {
          responseData.ref_img = 'deadheart_01.jpg';
        } else if (mode === 'pest') {
          responseData.ref_img = 'esb_01.jpg';
        }
        
        return res.status(response.status).json(responseData);
      }

      return res.status(response.status).json(response.data);
      
    } else {
      // Handle multipart request (with image)
      const form = formidable({
        maxFileSize: 8 * 1024 * 1024, // 8MB
        keepExtensions: true,
      });

      const [fields, files] = await form.parse(req);

      // Extract form fields
      const mode = Array.isArray(fields.mode) ? fields.mode[0] : fields.mode;
      const answers = Array.isArray(fields.answers) ? fields.answers[0] : fields.answers;
      const imageFile = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!mode) {
        return res.status(400).json({ 
          error: 'Missing required field: mode' 
        });
      }

      // Create form data for backend request
      const formData = new FormData();
      formData.append('mode', mode);
      
      if (answers) {
        formData.append('answers', answers);
      }
      
      if (imageFile) {
        formData.append('file', fs.createReadStream(imageFile.filepath), {
          filename: imageFile.originalFilename || 'upload.jpg',
          contentType: imageFile.mimetype || 'image/jpeg',
        });
      }

      // Forward request to backend using axios
      const response = await axios.post(`${backendUrl}/predict`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000,
        validateStatus: () => true, // Don't throw on HTTP error status
      });

      // Clean up temporary file
      if (imageFile) {
        try {
          fs.unlinkSync(imageFile.filepath);
        } catch (cleanupError) {
          console.warn('Failed to cleanup temp file:', cleanupError);
        }
      }

      // Add appropriate reference image URL based on mode and detection
      if (response.status === 200 && response.data) {
        const responseData = response.data;
        
        // Add reference image filename based on analysis mode
        if (mode === 'disease') {
          responseData.ref_img = 'deadheart_01.jpg';
        } else if (mode === 'pest') {
          responseData.ref_img = 'esb_01.jpg';
        }
        
        return res.status(response.status).json(responseData);
      }

      return res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error('Prediction proxy failed:', error);
    
    // More detailed error logging for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        contentType: req.headers['content-type'],
        method: req.method,
        url: req.url
      });
    }
    
    return res.status(500).json({
      error: 'Prediction request failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
