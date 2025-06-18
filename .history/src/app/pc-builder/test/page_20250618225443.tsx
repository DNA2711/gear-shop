"use client";

import React, { useState } from 'react';
import { useApi } from '@/hooks/useApi';

export default function PCBuilderTestPage() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { get } = useApi();

  const testAPIs = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test components API
      console.log('Testing PC Builder Components API...');
      
      const cpuResponse = await get('/api/pc-builder/components?category_code=cpu&limit=5');
      console.log('CPU Response:', cpuResponse);

      const vgaResponse = await get('/api/pc-builder/components?category_code=vga&limit=5');
      console.log('VGA Response:', vgaResponse);

      const ramResponse = await get('/api/pc-builder/components?category_code=ram&limit=5');
      console.log('RAM Response:', ramResponse);

      // Set components for display
      if (cpuResponse.success) {
        setComponents(cpuResponse.data.components);
      }

      // Test compatibility API
      const testBuild = {
        build_name: 'Test Build',
        components: {},
        total_price: 0,
        estimated_power: 0,
        compatibility_status: {
          is_compatible: true,
          warnings: [],
          errors: [],
        },
      };

      const compatibilityResponse = await fetch('/api/pc-builder/compatibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testBuild),
      });

      const compatibilityData = await compatibilityResponse.json();
      console.log('Compatibility Response:', compatibilityData);

    } catch (err) {
      console.error('API Test Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">PC Builder Test Page</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          
          <button
            onClick={testAPIs}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing APIs...' : 'Test PC Builder APIs'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              Error: {error}
            </div>
          )}
        </div>

        {components.length > 0 && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sample Components (CPU)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {components.map((component) => (
                <div key={component.product_id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{component.product_name}</h3>
                  <p className="text-sm text-gray-600">{component.brand_name}</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(component.price)}
                  </p>
                  <p className="text-sm text-gray-500">Stock: {component.stock_quantity}</p>
                  {component.specifications && component.specifications.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium">Key specs:</p>
                      {component.specifications.slice(0, 2).map((spec, index) => (
                        <p key={index} className="text-xs text-gray-600">
                          {spec.spec_name}: {spec.spec_value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Links</h2>
          <div className="space-y-2">
            <a 
              href="/pc-builder" 
              className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
            >
              Go to PC Builder
            </a>
            <a 
              href="/products" 
              className="block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center"
            >
              View All Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 