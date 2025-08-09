# GreenBytes UI - Next.js Frontend

Modern chat-style interface for multimodal sugarcane AI analysis built with Next.js, TypeScript, and shadcn/ui.

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env.local
# Edit BACKEND_URL to point to your API
```

3. **Run development server**:
```bash
npm run dev
# Frontend starts on http://localhost:3000
```

## 🎨 Features

- **Modern Chat Interface** - ChatGPT-style conversation UI
- **Multimodal Input** - Image upload + questionnaire forms
- **Real-time Analysis** - Live prediction results with visual feedback
- **Responsive Design** - Desktop and mobile optimized
- **shadcn/ui Components** - Beautiful, accessible UI components
- **Server-side Proxies** - CORS-free backend communication

## 🔧 Configuration

### Environment Variables

**Development** (`.env.local`):
```bash
BACKEND_URL=http://localhost:8000
```

**Production** (Vercel):
- `BACKEND_URL`: `http://<vm-ip>:8000` (Server-side only)

## 🌐 Connect to Backend

### Server-side Proxy Routes

The frontend uses Next.js API routes to proxy requests and avoid CORS issues:

- **Health Check**: `/api/health` → `{BACKEND_URL}/health`
- **Predictions**: `/api/predict` → `{BACKEND_URL}/predict`  
- **Status Monitor**: `/status` → Test backend connectivity

### Why Proxy Routes?
- ✅ **No CORS issues** between frontend/backend domains
- ✅ **No mixed-content warnings** (HTTPS → HTTP)
- ✅ **Secure backend URL** (server-side only)
- ✅ **Seamless user experience**

## 📱 Pages & Routes

### Main Application
- `/` - Main chat interface
- `/simple` - Simplified test interface
- `/status` - Backend connection monitor

### API Routes (Server-side)
- `/api/health` - Health check proxy
- `/api/predict` - Prediction proxy

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
# Test with deployed backend
BACKEND_URL=http://<vm-ip>:8000 npm run dev

# Test backend connectivity
npm run dev
# Then visit: http://localhost:3000/status
```

## 🧪 Testing

### Manual Testing
1. **Start frontend**: `npm run dev`
2. **Visit status page**: http://localhost:3000/status
3. **Test main app**: http://localhost:3000
   - Select mode (Disease/Pest)
   - Upload image
   - Answer questionnaire
   - Run analysis

### Backend Integration Testing
```bash
# Check if proxy routes work
curl http://localhost:3000/api/health

# Test with actual image upload
# Use the main UI at http://localhost:3000
```

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
