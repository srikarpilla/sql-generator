"use client";

import { useState } from "react";
import axios from "axios";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-tomorrow.css";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [schema, setSchema] = useState("");
  const [dialect, setDialect] = useState("PostgreSQL");
  const [sql, setSql] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setRateLimited(false);

    try {
      const res = await axios.post("http://localhost:8000/generate", {
        question,
        db_schema: schema,
        dialect,
      });

      setSql(res.data.sql);
      setExplanation(res.data.explanation);
      setTimeout(() => Prism.highlightAll(), 0);

    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 429) {
          setError(err.response.data.detail);
          setRateLimited(true);
        } else {
          setError("Server error. Please try again.");
        }
      } else {
        setError("Backend not reachable.");
      }
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <h1>English → SQL Generator</h1>

      <label>English Query</label>
      <textarea
        rows={3}
        placeholder="e.g. Get all users"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <label>Database Schema</label>
      <textarea
        rows={5}
        placeholder="CREATE TABLE users(id, name);"
        value={schema}
        onChange={(e) => setSchema(e.target.value)}
      />

      <label>SQL Dialect</label>
      <select value={dialect} onChange={(e) => setDialect(e.target.value)}>
        <option>PostgreSQL</option>
        <option>MySQL</option>
        <option>SQLite</option>
      </select>

      <button
        onClick={handleGenerate}
        disabled={loading || rateLimited}
      >
        {rateLimited
          ? "Daily Limit Reached"
          : loading
          ? "Generating SQL..."
          : "Generate SQL"}
      </button>

      <p style={{ fontSize: "12px", marginTop: "6px", color: "#555" }}>
        Free usage limited to 5 requests per day per IP.
      </p>

      {error && (
        <div style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
          {error}
        </div>
      )}

      {sql && (
        <pre className="language-sql">
          <code className="language-sql">{sql}</code>
        </pre>
      )}

      {explanation && (
        <div className="explanation">
          <strong>Explanation</strong>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}
