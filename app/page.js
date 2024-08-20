// app/page.js

"use client"; // Add this line at the top

import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/llama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResponseText(data.content);
    } catch (error) {
      console.error('Error:', error);
      setResponseText('Failed to fetch the response');
    }
  };

  return (
    <div>
      <h1>Ask Llama 3.1 via Groq</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text"
        />
        <button type="submit">Submit</button>
      </form>
      {responseText && <p>Response: {responseText}</p>}
    </div>
  );
}
