'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexMessage, setIndexMessage] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [configStatus, setConfigStatus] = useState('Checking configuration...');

  useEffect(() => {
    // Check configuration status
    const checkConfig = async () => {
      try {
        const res = await fetch('/api/vapi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: 'test' }]
          }),
        });
        
        if (res.ok) {
          const text = await res.text();
          if (text.includes('placeholder') || text.includes('configured')) {
            setConfigStatus('⚠️ API keys not configured - using fallback mode');
          } else {
            setConfigStatus('✅ RAG system configured and working');
          }
        } else {
          setConfigStatus('❌ API configuration error');
        }
      } catch (error) {
        setConfigStatus('❌ Cannot connect to API');
      }
    };
    
    checkConfig();
  }, []);

  const handleIndexDocuments = async () => {
    setIsIndexing(true);
    setIndexMessage('Starting document indexing...');
    
    try {
      const res = await fetch('/api/index-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      const data = await res.json();
      if (data.success) {
        setIndexMessage('Documents indexed successfully!');
      } else {
        setIndexMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setIndexMessage(`Error: ${error}`);
    } finally {
      setIsIndexing(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    setIsQuerying(true);
    setResponse('');
    setSources([]);
    
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      const data = await res.json();
      if (data.success) {
        setResponse(data.response);
        setSources(data.sources);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse(`Error: ${error}`);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">RAG System Admin</h1>
        
        {/* Configuration Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm">{configStatus}</span>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            To enable full RAG functionality, replace the placeholder values in .env.local with your actual API keys.
          </p>
        </div>
        
        {/* Document Indexing Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Document Indexing</h2>
          <p className="text-gray-600 mb-4">
            Index the sample documentation files into Pinecone for RAG queries.
          </p>
          <button
            onClick={handleIndexDocuments}
            disabled={isIndexing}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isIndexing ? 'Indexing...' : 'Index Documents'}
          </button>
          {indexMessage && (
            <p className={`mt-4 p-3 rounded ${
              indexMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {indexMessage}
            </p>
          )}
        </div>

        {/* Query Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test RAG Query</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ask a question about the documentation:
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., How do I authenticate with the API?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
              />
            </div>
            <button
              onClick={handleQuery}
              disabled={isQuerying || !query.trim()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isQuerying ? 'Querying...' : 'Ask Question'}
            </button>
          </div>

          {response && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Response:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{response}</p>
              </div>
            </div>
          )}

          {sources.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Sources:</h3>
              <div className="space-y-2">
                {sources.map((source, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-blue-800">{source.title}</p>
                    <p className="text-sm text-blue-600">Score: {source.score.toFixed(3)}</p>
                    <p className="text-sm text-gray-700 mt-1">{source.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
