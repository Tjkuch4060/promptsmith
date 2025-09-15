import React from "react";

interface ModelSelectorProps {
  selectedModels: string[];
  onModelChange: (models: string[]) => void;
}

const AVAILABLE_MODELS = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", icon: "🧠", color: "emerald" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", icon: "⚡", color: "blue" },
  { id: "mistralai/Mistral-7B-Instruct-v0.1", name: "Mistral 7B Instruct", provider: "Hugging Face", icon: "🌪️", color: "purple" },
  { id: "meta-llama/Llama-2-13b-chat", name: "Llama 2 13B Chat", provider: "Hugging Face", icon: "🦙", color: "orange" },
];

export default function ModelSelector({ selectedModels, onModelChange }: ModelSelectorProps) {
  const handleModelToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onModelChange(selectedModels.filter(id => id !== modelId));
    } else {
      onModelChange([...selectedModels, modelId]);
    }
  };

  return (
    <div className="card card-sparkle fade-in-up hover-lift">
      <h2 className="card-title">
        <span className="card-icon">🤖</span>
        Model Selection
      </h2>
      <p className="form-label">Select one or more models to compare responses</p>
      <div className="checkbox-group">
        {AVAILABLE_MODELS.map((model) => (
          <label 
            key={model.id} 
            className={`checkbox-item ${selectedModels.includes(model.id) ? 'checked' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedModels.includes(model.id)}
              onChange={() => handleModelToggle(model.id)}
            />
            <div className="flex items-center gap-2">
              <span className="text-xl">{model.icon}</span>
              <div>
                <div className="model-label font-semibold">{model.name}</div>
                <div className="text-sm text-gray-500">{model.provider}</div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}