import { useState } from "react";
import PromptEditor from "../components/PromptEditor";
import ModelSelector from "../components/ModelSelector";
import ResultsDisplay from "../components/ResultsDisplay";
import ThemeToggle from "../components/ThemeToggle";
import { runPromptRequest } from "../lib/api";

export default function Home() {
  const [prompt, setPrompt] = useState("Rewrite this paragraph to be more persuasive: {{text}}");
  const [inputs, setInputs] = useState<Record<string, string>>({ text: "This product might help people lose weight." });
  const [selectedModels, setSelectedModels] = useState(["gpt-3.5-turbo"]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const handleRun = async () => {
    if (selectedModels.length === 0) {
      setStatusMessage("Please select at least one model");
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    setStatusMessage("Initializing request...");
    setResults(null);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 20;
      });
    }, 500);

    try {
      setStatusMessage(`Sending prompts to ${selectedModels.length} model(s)...`);
      setLoadingProgress(25);

      const payload = {
        prompt,
        inputs,
        models: selectedModels,
        params: { temperature: 0.7, max_tokens: 250 }
      };

      setStatusMessage("Processing responses...");
      setLoadingProgress(60);

      const response = await runPromptRequest(payload);
      
      setLoadingProgress(90);
      setStatusMessage("Calculating metrics...");
      
      setTimeout(() => {
        setResults(response);
        setLoadingProgress(100);
        setStatusMessage(`✅ Successfully analyzed ${selectedModels.length} model response(s)`);
        clearInterval(progressInterval);
        
        setTimeout(() => {
          setStatusMessage("");
        }, 3000);
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error running prompt:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setStatusMessage(`❌ ${errorMessage}`);
      setTimeout(() => setStatusMessage(""), 8000);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="app-container">
      <ThemeToggle />
      <div className="container">
        <header className="app-header fade-in-up">
          <h1 className="app-title">🧰 PromptSmith</h1>
          <p className="app-subtitle">AI Prompt Engineering IDE - Compare multiple models simultaneously</p>
        </header>
        
        <main className="main-grid grid gap-6">
          <div className="fade-in-up">
            <PromptEditor prompt={prompt} setPrompt={setPrompt} variables={inputs} setVariables={setInputs} />
          </div>
          
          <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <ModelSelector selectedModels={selectedModels} onModelChange={setSelectedModels} />
          </div>
          
          <div className="text-center fade-in-up" style={{ animationDelay: '0.2s' }}>
            {statusMessage && (
              <div className={`status-indicator mb-4 ${
                statusMessage.includes('✅') ? 'status-success' : 
                statusMessage.includes('❌') ? 'status-error' : 
                'status-processing'
              }`}>
                {statusMessage}
              </div>
            )}
            
            {isLoading && loadingProgress > 0 && (
              <div className="progress-bar-container mb-4">
                <div 
                  className="progress-bar" 
                  style={{ width: `${loadingProgress}%`, transition: 'width 0.5s ease' }}
                ></div>
              </div>
            )}
            
            <button 
              onClick={handleRun} 
              disabled={isLoading}
              className={`btn btn-primary hover-lift ${isLoading ? 'btn-loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="loading-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  Processing...
                </>
              ) : (
                <>
                  🚀 Run Prompt Analysis
                </>
              )}
            </button>
          </div>
          
          {results && (
            <div className="results-section fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="results-header">
                <h2 className="results-title text-gradient-animated">Model Comparison Results</h2>
              </div>
              <ResultsDisplay results={results} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
