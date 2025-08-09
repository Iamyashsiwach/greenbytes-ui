/**
 * Server-side proxy for backend prediction endpoint
 * Forwards multipart form data to backend and returns response
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';

// Disable default body parser to handle multipart data
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

  const backendUrl = process.env.BACKEND_ORIGIN || 'http://localhost:8000';

  try {
    // Parse the multipart form data
    const form = formidable({
      maxFileSize: 8 * 1024 * 1024, // 8MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    // Extract form fields
    const mode = Array.isArray(fields.mode) ? fields.mode[0] : fields.mode;
    const answers = Array.isArray(fields.answers) ? fields.answers[0] : fields.answers;
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!mode || !answers || !imageFile) {
      return res.status(400).json({ 
        error: 'Missing required fields: mode, answers, or image' 
      });
    }

    // Create form data for backend request
    const formData = new FormData();
    formData.append('mode', mode);
    formData.append('answers', answers);
    formData.append('image', fs.createReadStream(imageFile.filepath), {
      filename: imageFile.originalFilename || 'upload.jpg',
      contentType: imageFile.mimetype || 'image/jpeg',
    });

    // Forward request to backend using axios (better FormData support)
    const response = await axios.post(`${backendUrl}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000,
      validateStatus: () => true, // Don't throw on HTTP error status
    });

    // Clean up temporary file
    try {
      fs.unlinkSync(imageFile.filepath);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', cleanupError);
    }

    // Return response with proper status code
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Prediction proxy failed:', error);
    return res.status(500).json({
      error: 'Prediction request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
