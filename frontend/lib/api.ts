import axios from "axios";

export async function runPromptRequest(payload) {
  const res = await axios.post("http://localhost:8000/run-prompt", payload);
  return res.data;
}
