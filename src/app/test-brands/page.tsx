"use client";

import { useState, useEffect } from "react";
import { Brand } from "@/types/brand";

export default function TestBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/brands");
      const data = await response.json();
      setBrands(data);
      setResult(`Fetched ${data.length} brands successfully`);
    } catch (error) {
      setResult(`Error fetching brands: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestBrand = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand_name: "Test Brand " + Date.now(),
          brand_code: "test" + Date.now(),
          logo_code: "https://via.placeholder.com/100",
          website: "https://example.com",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(`Created brand successfully: ${JSON.stringify(data)}`);
        fetchBrands(); // Refresh list
      } else {
        const error = await response.json();
        setResult(`Error creating brand: ${error.error}`);
      }
    } catch (error) {
      setResult(`Error creating brand: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test Brands API</h1>

      <div className="space-y-4 mb-6">
        <button
          onClick={fetchBrands}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Fetch Brands"}
        </button>

        <button
          onClick={createTestBrand}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 ml-2"
        >
          {loading ? "Creating..." : "Create Test Brand"}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <h3 className="font-bold mb-2">Result:</h3>
        <pre className="text-sm">{result}</pre>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h3 className="text-lg font-bold p-4 border-b">
          Brands List ({brands.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Code</th>
                <th className="px-4 py-2 text-left">Website</th>
                <th className="px-4 py-2 text-left">Logo</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.brand_id} className="border-t">
                  <td className="px-4 py-2">{brand.brand_id}</td>
                  <td className="px-4 py-2">{brand.brand_name}</td>
                  <td className="px-4 py-2 font-mono text-sm bg-gray-100">
                    {brand.brand_code}
                  </td>
                  <td className="px-4 py-2">
                    {brand.website ? (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {brand.website}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {brand.logo_code ? (
                      <img
                        src={brand.logo_code}
                        alt={brand.brand_name}
                        className="h-8 w-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjE1TTkgMTJIMTUiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+";
                        }}
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {brand.brand_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
