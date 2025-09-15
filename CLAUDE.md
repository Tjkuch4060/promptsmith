# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

PromptSmith is an AI Prompt Engineering IDE with a FastAPI backend and Next.js frontend:

### Backend Structure
- `main.py` - FastAPI app with single `/run-prompt` endpoint for executing prompts across models
- `runner.py` - Core prompt execution logic supporting OpenAI and Hugging Face models
- `metrics.py` - Evaluation system using sentence-transformers for semantic similarity analysis

### Frontend Structure  
- Next.js app in `frontend/` directory with TypeScript
- `pages/index.tsx` - Main playground interface
- `components/PromptEditor.tsx` - Prompt editing component
- `lib/api.ts` - API client for backend communication

### Model Integration
- OpenAI models: GPT-4, GPT-3.5-turbo via OpenAI API
- Hugging Face models: Mistral-7B-Instruct, Llama-2-13b-chat via Inference API
- Async execution allows parallel model requests

## Development Commands

### Backend (Python)
```bash
# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload --port 8000

# Run backend directly
python main.py
```

### Frontend (Next.js)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server  
npm start
```

## Environment Setup

Create `.env` file with:
```
OPENAI_API_KEY=your_openai_key_here
HF_API_KEY=your_huggingface_key_here
```

## Key Implementation Details

- Backend runs on port 8000 with CORS enabled for localhost:3000
- Frontend expects backend at localhost:8000
- Prompt templating uses Python string formatting: `{{variable}}`
- Metrics calculate semantic similarity between model outputs using all-MiniLM-L6-v2
- Async model execution with error handling in `runner.py:18-26`
- Model-specific parameter mapping in `runner.py:28-55`