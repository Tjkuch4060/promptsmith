import { useState } from "react";
import PromptEditor from "../components/PromptEditor";
import { runPromptRequest } from "../lib/api";

export default function Home() {
  const [prompt, setPrompt] = useState("Rewrite this paragraph to be more persuasive: {{text}}");
  const [inputs, setInputs] = useState({ text: "This product might help people lose weight." });
  const [results, setResults] = useState(null);

  const handleRun = async () => {
    const payload = {
      prompt,
      inputs,
      models: ["gpt-4"],
      params: { temperature: 0.7, max_tokens: 250 }
    };
    const response = await runPromptRequest(payload);
    setResults(response);
  };

  return (
    <main className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">🧰 PromptSmith Playground</h1>
      <PromptEditor prompt={prompt} setPrompt={setPrompt} variables={inputs} setVariables={setInputs} />
      <button onClick={handleRun} className="mt-4 px-4 py-2 bg-black text-white rounded">🚀 Run Prompt</button>
      {results && (
        <pre className="mt-6 p-4 bg-gray-100 border rounded text-sm whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
      )}
    </main>
  );
}
