from openai import AsyncOpenAI
import aiohttp
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
HF_API_KEY = os.getenv("HF_API_KEY")

# Initialize OpenAI client only if API key is available
client = None
if OPENAI_API_KEY:
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)

OPENAI_MODELS = {"gpt-4", "gpt-3.5-turbo"}
HF_MODELS = {
    "mistralai/Mistral-7B-Instruct-v0.1",
    "meta-llama/Llama-2-13b-chat"
}

async def run_prompt_across_models(request):
    tasks = []
    for model in request.models:
        if model in OPENAI_MODELS:
            tasks.append(run_openai_model(request.prompt, request.inputs, model, request.params))
        elif model in HF_MODELS:
            tasks.append(run_hf_model(request.prompt, request.inputs, model, request.params))
        else:
            # Skip unknown models but could log a warning
            continue
    
    if not tasks:
        raise ValueError("No valid models were specified")
    
    results = await asyncio.gather(*tasks)
    return {model: output for model, output in results}

async def run_openai_model(prompt, inputs, model, params):
    if not client:
        raise ValueError("OpenAI API key not configured")
        
    # Convert double braces {{var}} to single braces {var} for Python formatting
    rendered_prompt = prompt
    if inputs:
        for key, value in inputs.items():
            rendered_prompt = rendered_prompt.replace(f"{{{{{key}}}}}", str(value))
    
    response = await client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": rendered_prompt}],
        temperature=params.get("temperature", 0.7),
        max_tokens=params.get("max_tokens", 300)
    )
    return model, response.choices[0].message.content

async def run_hf_model(prompt, inputs, model, params):
    if not HF_API_KEY:
        raise ValueError("Hugging Face API key not configured")
        
    # Convert double braces {{var}} to single braces {var} for Python formatting
    rendered_prompt = prompt
    if inputs:
        for key, value in inputs.items():
            rendered_prompt = rendered_prompt.replace(f"{{{{{key}}}}}", str(value))
    
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}"
    }
    payload = {
        "inputs": rendered_prompt,
        "parameters": {
            "temperature": params.get("temperature", 0.7),
            "max_new_tokens": params.get("max_tokens", 300)
        }
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(f"https://api-inference.huggingface.co/models/{model}", headers=headers, json=payload) as resp:
            json_response = await resp.json()
            generated = json_response[0]['generated_text'] if isinstance(json_response, list) else json_response.get('generated_text', '')
            return model, generated
