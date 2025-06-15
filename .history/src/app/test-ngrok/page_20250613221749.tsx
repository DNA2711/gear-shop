'use client';

import { useState, useEffect } from 'react';

export default function TestNgrokPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('loading');
        setMessage('Đang kiểm tra kết nối ngrok...');
        
        const response = await fetch('/api/test-ngrok');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to connect to ngrok');
        }
        
        setStatus('success');
        setMessage('Kết nối ngrok thành công!');
        setUrl(data.url);
      } catch (error) {
        console.error('Error testing ngrok:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to connect to ngrok');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Kiểm tra kết nối Ngrok</h1>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              status === 'loading' ? 'bg-yellow-400 animate-pulse' :
              status === 'success' ? 'bg-green-400' :
              'bg-red-400'
            }`} />
            <p className="text-gray-700">{message}</p>
          </div>

          {status === 'loading' && (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          )}

          {status === 'success' && url && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 font-medium">URL ngrok:</p>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-green-600 hover:text-green-700 break-all"
              >
                {url}
              </a>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                Có lỗi xảy ra khi kết nối ngrok. Vui lòng kiểm tra:
              </p>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                <li>Token ngrok đã được cấu hình trong .env.local</li>
                <li>Ứng dụng đang chạy trên port 3000</li>
                <li>Không có kết nối ngrok nào đang chạy</li>
              </ul>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
} 