import { useState } from "react";

const API_URL = "http://127.0.0.1:5000/api/generate";

const emptyResult = {
  hook: "",
  script: "",
  title: "",
  description: "",
  hashtags: [],
  image_prompt: "",
  video_prompt: "",
};

function ResultCard({ icon, title, value }) {
  const text = Array.isArray(value) ? value.join(" ") : value;

  const copy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <div className="result-card">
      <div className="result-top">
        <h2>
          {icon} {title}
        </h2>

        <button onClick={copy} disabled={!text}>
          Copy
        </button>
      </div>

      <div className="result-text">
        {text || "Generated content will appear here."}
      </div>
    </div>
  );
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("10 seconds");
  const [style, setStyle] = useState("Viral");

  const [result, setResult] = useState(emptyResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateShort() {
    if (!topic.trim()) {
      setError("Please enter a video topic.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(emptyResult);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
          language,
          duration,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Generation failed.");
      }

      setResult(data.data);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to backend. Make sure Node and Python are running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <main className="container">
        <header className="hero">
          <div className="badge">AI CONTENT ENGINE</div>

          <h1>
            Shorts <span>AI Studio</span>
          </h1>

          <p>
            One topic. Seven ready-to-use pieces of Shorts content.
          </p>
        </header>

        <section className="generator">
          <label className="label">Video Topic</label>

          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: A hydraulic press crushes a futuristic engine"
          />

          <div className="controls">
            <div>
              <label className="label">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>English</option>
                <option>Urdu</option>
                <option>Hindi</option>
              </select>
            </div>

            <div>
              <label className="label">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option>10 seconds</option>
                <option>15 seconds</option>
                <option>20 seconds</option>
                <option>30 seconds</option>
                <option>45 seconds</option>
                <option>60 seconds</option>
              </select>
            </div>

            <div>
              <label className="label">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option>Viral</option>
                <option>Cinematic</option>
                <option>Satisfying</option>
                <option>Educational</option>
                <option>Documentary</option>
              </select>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="generate"
            onClick={generateShort}
            disabled={loading}
          >
            {loading ? "Generating..." : "🚀 Generate Short"}
          </button>
        </section>

        <section className="results">
          <div className="section-heading">
            <div className="badge">GENERATED CONTENT</div>
            <h2>Your Shorts Package</h2>
          </div>

          <ResultCard icon="🔥" title="Viral Hook" value={result.hook} />
          <ResultCard icon="🎬" title="Short Script" value={result.script} />
          <ResultCard icon="🏷️" title="Title" value={result.title} />
          <ResultCard
            icon="📝"
            title="Description"
            value={result.description}
          />
          <ResultCard icon="#️⃣" title="Hashtags" value={result.hashtags} />
          <ResultCard
            icon="🎨"
            title="AI Image Prompt"
            value={result.image_prompt}
          />
          <ResultCard
            icon="🎥"
            title="AI Video Prompt"
            value={result.video_prompt}
          />
        </section>

        <footer>Shorts AI Studio • Node.js + Python + Gemini</footer>
      </main>
    </div>
  );
}