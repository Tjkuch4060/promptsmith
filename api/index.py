from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from runner import run_prompt_across_models
from metrics import evaluate_outputs

app = FastAPI()

# Enable CORS for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str
    inputs: Optional[dict] = None
    models: List[str]
    params: dict

class PromptResponse(BaseModel):
    outputs: dict
    metrics: dict

@app.post("/api/run-prompt", response_model=PromptResponse)
async def run_prompt(request: PromptRequest):
    try:
        start = time.time()
        outputs = await run_prompt_across_models(request)
        metrics = evaluate_outputs(outputs)
        latency = time.time() - start
        metrics["latency"] = latency
        return PromptResponse(outputs=outputs, metrics=metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# For Vercel serverless functions
def handler(request, context):
    from mangum import Mangum
    asgi_handler = Mangum(app)
    return asgi_handler(request, context)