import React from "react";

interface PromptEditorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  variables: Record<string, string>;
  setVariables: (variables: Record<string, string>) => void;
}

export default function PromptEditor({ prompt, setPrompt, variables, setVariables }: PromptEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariables({ ...variables, [e.target.name]: e.target.value });
  };

  return (
    <div className="card card-sparkle fade-in-up hover-lift">
      <h2 className="card-title">
        <span className="card-icon">📝</span>
        Prompt Editor
      </h2>
      <div className="form-group">
        <label className="form-label">Your Prompt Template</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="form-textarea"
          placeholder="Enter your prompt template here. Use {{variable}} syntax for dynamic inputs..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">
          <span className="card-icon">🧩</span>
          Input Variables
        </label>
        <div className="grid gap-4">
          {Object.keys(variables).map((key) => (
            <div key={key} className="form-group">
              <label className="form-label text-sm">{`{{${key}}}`}</label>
              <input
                name={key}
                value={variables[key]}
                onChange={handleChange}
                className="form-input"
                placeholder={`Enter value for {{${key}}}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
