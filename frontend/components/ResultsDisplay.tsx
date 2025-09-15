import React from "react";

interface ResultsDisplayProps {
  results: {
    outputs: Record<string, string>;
    metrics: Record<string, { avg_similarity: number; length_tokens: number }> & { latency: number };
  };
}

const MODEL_DISPLAY_INFO: Record<string, { name: string; icon: string; badge: string }> = {
  "gpt-4": { name: "GPT-4", icon: "🧠", badge: "Premium" },
  "gpt-3.5-turbo": { name: "GPT-3.5 Turbo", icon: "⚡", badge: "Fast" },
  "mistralai/Mistral-7B-Instruct-v0.1": { name: "Mistral 7B", icon: "🌪️", badge: "Open" },
  "meta-llama/Llama-2-13b-chat": { name: "Llama 2 13B", icon: "🦙", badge: "Large" },
};

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { outputs, metrics } = results;
  const modelNames = Object.keys(outputs);

  return (
    <div className="grid gap-6">
      <div className="card card-sparkle hover-lift">
        <h2 className="card-title">
          <span className="card-icon">📊</span>
          Results Summary
        </h2>
        <div className="metrics">
          <div className="metric-item">
            <strong>Total Latency:</strong> {metrics.latency.toFixed(2)}s
          </div>
          <div className="metric-item">
            <strong>Models Compared:</strong> {modelNames.length}
          </div>
        </div>
      </div>

      <div className="results-grid">
        {modelNames.map((modelId) => {
          const modelInfo = MODEL_DISPLAY_INFO[modelId] || { name: modelId, icon: "🤖", badge: "Model" };
          return (
            <div key={modelId} className="result-card">
              <div className="result-header">
                <div className="model-name">
                  <span className="text-2xl">{modelInfo.icon}</span>
                  {modelInfo.name}
                  <span className="model-badge">{modelInfo.badge}</span>
                </div>
              </div>
              
              <div className="metrics mb-4">
                <div className="metric-item">
                  <strong>Tokens:</strong> {metrics[modelId]?.length_tokens || 0}
                </div>
                {metrics[modelId] && (
                  <div className="metric-item">
                    <strong>Similarity:</strong> {(metrics[modelId].avg_similarity * 100).toFixed(1)}%
                  </div>
                )}
              </div>

              <div className="result-content">
                {outputs[modelId]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card card-sparkle hover-lift">
        <details>
          <summary className="cursor-pointer font-semibold text-gray-700 flex items-center gap-2">
            <span className="card-icon">🔍</span>
            Raw JSON Data
          </summary>
          <pre className="mt-4 p-4 bg-gray-50 border rounded text-sm whitespace-pre-wrap overflow-auto max-h-96">
            {JSON.stringify(results, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}