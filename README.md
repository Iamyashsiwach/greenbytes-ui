# GreenBytes UI - Next.js Frontend v0.2.0

Advanced multimodal chat interface for sugarcane AI analysis with enhanced mobile responsiveness and optimized performance. Features proxy-based backend integration and comprehensive accessibility improvements.

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment** (create `.env.local`):
```bash
NEXT_PUBLIC_API_BASE_URL=/api
BACKEND_ORIGIN=http://localhost:8000
```

3. **Run development server**:
```bash
npm run dev
# Frontend starts on http://localhost:3000
# Calls /api routes which proxy to BACKEND_ORIGIN
```

## 🎨 Features

- **Multimodal Analysis** - Supports answers-only, image-only, and combined modes
- **Proxy-based Architecture** - CORS-free backend communication via Next.js API routes
- **Real-time Results** - Live analysis with YOLO, TabNet, and fusion results
- **Decision Transparency** - Shows trace of how decisions were made
- **Reference Images** - Visual comparison for detected conditions
- **Responsive Design** - Mobile-friendly interface

## 🔧 Configuration

### Environment Variables

**Development** (`.env.local`):
```bash
NEXT_PUBLIC_API_BASE_URL=/api
BACKEND_ORIGIN=http://localhost:8000
```

**Production** (`.env.production`):
```bash
NEXT_PUBLIC_API_BASE_URL=/api
BACKEND_ORIGIN=http://20.193.136.83:8000
```

## 🌐 API Integration

### Proxy Routes Architecture

Client calls → Next.js API routes → FastAPI backend

- **Client**: `fetch('/api/predict')` 
- **Proxy**: `/api/predict` → `${BACKEND_ORIGIN}/predict`
- **Backend**: FastAPI handles multimodal inference

### Supported Analysis Modes

1. **Answers Only**: JSON request with questionnaire responses
2. **Image Only**: Multipart request with uploaded image
3. **Combined**: Multipart request with both image and answers

## 📱 Pages & Routes

### Main Application
- `/multimodal` - **Main multimodal analysis interface**
- `/` - Legacy chat interface
- `/simple` - Simple test interface
- `/status` - Backend connection monitor

### API Routes (Server-side Proxies)
- `/api/health` - Health check proxy to backend
- `/api/predict` - Prediction proxy to backend

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**:
   - Link GitHub repo to Vercel project

2. **Environment Variables** (Project Settings):
   ```
   Key: BACKEND_URL
   Value: http://<vm-ip>:8000
   Scope: Server-side only
   ```

3. **Deploy**:
   - Auto-deploys on every push to `main`

### Local Testing with Remote Backend
```bash
# Edit .env.local
BACKEND_ORIGIN=http://20.193.136.83:8000

# Start frontend
npm run dev

# Test: http://localhost:3000/multimodal
```

## 🧪 Testing

### Testing Steps

1. **Start frontend**: `npm run dev`
2. **Visit multimodal page**: http://localhost:3000/multimodal
3. **Test analysis modes**:
   - **Answers Only**: Uncheck "Include Image", answer questions, run analysis
   - **Image Only**: Upload image, run analysis
   - **Combined**: Upload image AND answer questions, run analysis

### Expected Results
- ✅ Three analysis panels: YOLO, TabNet, Final Verdict
- ✅ Decision trace showing how result was determined
- ✅ Reference image for comparison
- ✅ API health indicator shows "Online"

## 🏗️ Architecture

### Tech Stack
- **Next.js 14** - React framework with API routes
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Component Structure
```
components/
├── ui/              # shadcn/ui base components
├── ChatWindow.tsx   # Main chat interface
├── MessageBubble.tsx # User/assistant messages  
├── Composer.tsx     # Input form (mode + image + questions)
├── ModelSummary.tsx # AI results display
├── AnswersTable.tsx # Q&A response table
└── RefImage.tsx     # Reference image display
```

### Page Structure
```
pages/
├── index.tsx        # Main app
├── simple.tsx       # Simple test interface
├── status.tsx       # Backend status monitor
└── api/
    ├── health.ts    # Health proxy
    └── predict.ts   # Prediction proxy
```

## 🎯 User Experience

### Chat Flow
1. **Welcome Screen** - Feature highlights and instructions
2. **Mode Selection** - Disease vs Pest detection
3. **Image Upload** - Drag-drop or click to upload
4. **Questionnaire** - 10 questions with Yes/No/Unknown
5. **Analysis** - Loading state with progress
6. **Results** - YOLO + TabNet + Fusion results
7. **Reference** - Comparison images if detected
8. **History** - Conversation-style message history

### Mobile Experience
- Responsive design adapts to screen size
- Touch-friendly upload and form controls
- Optimized card layouts for mobile viewing

## 🔧 Development

### Build Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
```

### Adding New Components
```bash
# Use shadcn/ui component generator
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
# etc.
```

## 🤝 Team GreenBytes

VIT Vellore Hackathon - Agricultural AI Technology

**Frontend Features**:
- Modern chat interface for AI interaction
- Seamless backend integration via proxy routes
- Professional UI built with industry-standard tools
