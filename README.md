# PromptSmith

An AI Prompt Engineering IDE to test, compare, and debug prompts across LLMs.

## Deployment to Vercel

This project is configured for deployment to Vercel with both the Next.js frontend and Python backend as serverless functions.

### Prerequisites

- Vercel account
- OpenAI API key (optional)
- Hugging Face API key (optional)

### Environment Variables

Configure the following environment variables in your Vercel dashboard:

- `OPENAI_API_KEY`: Your OpenAI API key for GPT models
- `HF_API_KEY`: Your Hugging Face API token for open-source models
- `NODE_ENV`: Set to `production` for production deployments

### Deployment Steps

1. Fork or clone this repository
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy - Vercel will automatically detect the configuration

### Architecture

- **Frontend**: Next.js app deployed as static files and serverless functions
- **Backend**: FastAPI app deployed as Vercel serverless functions via Mangum
- **API Routes**: All backend routes are prefixed with `/api/`

### Local Development

```bash
# Backend (Terminal 1)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (Terminal 2)  
cd frontend
npm install
npm run dev
```

### Features

- Multi-model prompt testing (OpenAI GPT, Hugging Face models)
- Semantic similarity analysis between model outputs
- Real-time prompt editing and templating
- Responsive web interface