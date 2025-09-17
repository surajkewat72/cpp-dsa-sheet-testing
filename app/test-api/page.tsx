'use client';

import { useState } from 'react';

export default function TestApiPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testContributorsAPI = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/contributors');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
            console.error('Contributors API Test Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const testAPI = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/questions');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
            console.error('API Test Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const testDatabaseConnection = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/questions');
            const data = await response.json();

            setResult({
                status: response.status,
                ok: response.ok,
                data: data
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">API Test Page</h1>

            <div className="space-y-4">
                <button
                    onClick={testContributorsAPI}
                    disabled={loading}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-4"
                >
                    {loading ? 'Testing...' : 'Test Contributors API (Working)'}
                </button>

                <button
                    onClick={testAPI}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                >
                    {loading ? 'Testing...' : 'Test Questions API'}
                </button>

                <button
                    onClick={testDatabaseConnection}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    {loading ? 'Testing...' : 'Test Database Connection'}
                </button>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <h2 className="font-bold">Error:</h2>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="mt-6 p-4 bg-gray-100 border rounded">
                    <h2 className="font-bold mb-2">Result:</h2>
                    <pre className="bg-black text-green-400 p-4 rounded overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}