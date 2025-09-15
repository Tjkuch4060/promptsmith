import axios from "axios";

export async function runPromptRequest(payload) {
  try {
    const res = await axios.post("http://localhost:8000/run-prompt", payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', error.response.data);
      throw new Error(`API Error: ${error.response.data.detail || error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response
      console.error('API No Response:', error.request);
      throw new Error('No response from API server. Please check if the backend is running.');
    } else {
      // Something else happened
      console.error('API Request Error:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}
