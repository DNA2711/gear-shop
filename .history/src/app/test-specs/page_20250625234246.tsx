"use client";

import { useState } from "react";

export default function TestSpecsPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testDeleteAll = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products/25/specifications", {
        method: "DELETE",
      });
      const result = await response.json();
      setResult(`DELETE: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setResult(`DELETE Error: ${error}`);
    }
    setLoading(false);
  };

  const testAddSpec = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products/25/specifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spec_name: "Test Specification",
          spec_value: "Test Value",
          display_order: 1,
        }),
      });
      const result = await response.json();
      setResult(`POST: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setResult(`POST Error: ${error}`);
    }
    setLoading(false);
  };

  const testGetSpecs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products/25/specifications");
      const result = await response.json();
      setResult(`GET: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setResult(`GET Error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Specifications API</h1>

      <div className="space-y-4 mb-6">
        <button
          onClick={testGetSpecs}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
        >
          GET Specifications
        </button>

        <button
          onClick={testDeleteAll}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded mr-4"
        >
          DELETE All Specs
        </button>

        <button
          onClick={testAddSpec}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded mr-4"
        >
          ADD Specification
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
