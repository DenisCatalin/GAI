"use client"

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);

  const generateIdeas = async () => {
    setLoading(true);
    setIdeas([]);
    try {
      const response = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      setIdeas(data.ideas);
      
      await generateImage(topic);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    }
    setLoading(false);
  };

  const generateImage = async (prompt: string) => {
    setImageLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setImageLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-slate-500">AI Multimedia Project Generator</h1>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic..."
        className="w-1/3 p-2 border border-gray-300 rounded-md text-slate-500"
      />
      <button
        onClick={generateIdeas}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Ideas"}
      </button>

      {ideas.length > 0 && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          {imageLoading ? (
            <div className="mt-6 text-slate-500">Generating image...</div>
          ) : generatedImageUrl ? (
            <Image 
              className="mt-6 rounded-md" 
              src={generatedImageUrl} 
              alt="Generated" 
              width={250} 
              height={250}
            />
          ) : (
            <Image 
              className="mt-6 rounded-md" 
              src="/images/main.webp" 
              alt="AI" 
              width={250} 
              height={250}
            />
          )}
          <div className="mt-6 w-1/2 bg-white p-4 shadow-md rounded-md overflow-auto max-h-96">
            <h2 className="text-lg font-semibold text-slate-500">Generated Ideas:</h2>
            <ul className="text-slate-500">
              {ideas.map((idea, index) => (
                <li className="mt-4" key={index}>{idea}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
