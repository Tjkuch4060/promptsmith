import openai
import aiohttp
import asyncio
import os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
HF_API_KEY = os.getenv("HF_API_KEY")

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
    results = await asyncio.gather(*tasks)
    return {model: output for model, output in results}

async def run_openai_model(prompt, inputs, model, params):
    rendered_prompt = prompt.format(**(inputs or {}))
    openai.api_key = OPENAI_API_KEY
    response = openai.ChatCompletion.create(
        model=model,
        messages=[{"role": "user", "content": rendered_prompt}],
        temperature=params.get("temperature", 0.7),
        max_tokens=params.get("max_tokens", 300)
    )
    return model, response.choices[0].message["content"]

async def run_hf_model(prompt, inputs, model, params):
    rendered_prompt = prompt.format(**(inputs or {}))
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
