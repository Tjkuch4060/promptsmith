import React from "react";

export default function PromptEditor({ prompt, setPrompt, variables, setVariables }) {
  const handleChange = (e) => {
    setVariables({ ...variables, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">📝 Prompt Editor</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-40 border border-gray-300 p-2 rounded text-sm font-mono"
      />
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-1">🧩 Input Variables</h3>
        {Object.keys(variables).map((key) => (
          <input
            key={key}
            name={key}
            value={variables[key]}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded text-sm"
            placeholder={`Value for {{${key}}}`}
          />
        ))}
      </div>
    </div>
  );
}
