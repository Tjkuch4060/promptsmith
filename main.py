from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time

from runner import run_prompt_across_models
from metrics import evaluate_outputs

app = FastAPI()

# Enable CORS for the Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
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

@app.post("/run-prompt", response_model=PromptResponse)
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
