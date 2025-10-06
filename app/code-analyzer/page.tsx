"use client";
import React, { useState, useMemo } from 'react';
import { Loader2, ChevronDown, Code2, Zap, Brain, Timer, Database, Activity, Gauge, Lightbulb } from 'lucide-react';
import { analyzeWithOpenAI } from '@/lib/openaiAnalyze';
import Navbar from '@/components/Navbar';

const languages = [
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
];

// Map complexity to a normalized scale and labels for UI visualization
const complexityScale: { pattern: RegExp; label: string; score: number; color: string; desc: string }[] = [
  { pattern: /^O\(1\)$/i, label: 'Constant', score: 5, color: 'bg-emerald-500', desc: 'Ideal performance.' },
  { pattern: /^O\(log n\)|log/i, label: 'Logarithmic', score: 15, color: 'bg-green-500', desc: 'Scales very well.' },
  { pattern: /^O\(n\)/i, label: 'Linear', score: 35, color: 'bg-lime-500', desc: 'Scales proportionally.' },
  { pattern: /n log n/i, label: 'Linearithmic', score: 50, color: 'bg-yellow-500', desc: 'Good for large inputs.' },
  { pattern: /n\^2|O\(n\s*\^\s*2\)/i, label: 'Quadratic', score: 70, color: 'bg-orange-500', desc: 'May struggle at very large sizes.' },
  { pattern: /n\^3|O\(n\s*\^\s*3\)/i, label: 'Cubic', score: 85, color: 'bg-rose-500', desc: 'High cost for big data.' },
  { pattern: /2\^n|exponential/i, label: 'Exponential', score: 95, color: 'bg-red-600', desc: 'Explodes quickly; optimize!' },
];

function classifyComplexity(raw: string) {
  for (const c of complexityScale) {
    if (c.pattern.test(raw)) return c;
  }
  // Fallback heuristics
  return { label: 'Unknown', score: 60, color: 'bg-gray-500', desc: 'Could not confidently classify.' };
}

function optimizationTips(time: string, space: string): string[] {
  const tips: string[] = [];
  if (/2\^n|exponential/i.test(time)) {
    tips.push('Look for overlapping subproblems to apply memoization or convert to dynamic programming.');
    tips.push('Reduce branching factor; prune unneeded recursion paths early.');
  }
  if (/n\^2/.test(time)) {
    tips.push('See if nested loops can be reduced via hashing (O(1) lookups) or sorting (O(n log n)).');
    tips.push('Check if early exits or break conditions can skip iterations.');
  }
  if (/n\^3/.test(time)) {
    tips.push('Consider matrix exponentiation / divide-and-conquer to reduce power.');
    tips.push('Profile innermost loop: can it be cached or vectorized?');
  }
  if (/O\(n\)/i.test(time) && /O\(n\)/i.test(space)) {
    tips.push('Can streaming / in-place processing cut auxiliary space to O(1)?');
  }
  if (/dynamic allocation/i.test(space)) {
    tips.push('Reuse buffers or preallocate to reduce GC / allocation overhead.');
  }
  if (tips.length === 0) tips.push('Algorithm already efficient for most use cases. Focus on input constraints and constants.');
  return tips;
}

function estimateComplexity(code: string, language: string) {
  let time = 'O(1)';
  let space = 'O(1)';
  const loopPatterns = [/for\s*\(/g, /while\s*\(/g, /for\s+\w+\s*:/g];
  const recursionPattern = /\breturn\s+\w+\s*\(/g;
  let loopCount = 0;
  loopPatterns.forEach((pat) => {
    const matches = code.match(pat);
    if (matches) loopCount += matches.length;
  });
  if (loopCount === 1) time = 'O(n)';
  if (loopCount > 1) time = 'O(n^' + loopCount + ')';
  if (recursionPattern.test(code)) time = 'O(2^n) or O(n log n) (recursive detected)';
  if (/new\s+|malloc|\[\]/.test(code)) space = 'O(n) (dynamic allocation detected)';
  if (/\bint\s+\w+\[.*\]/.test(code) || /\bvector<.*>\s+\w+/.test(code)) space = 'O(n) (array/vector detected)';
  return { time, space };
}

const CodeAnalyzerPage = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [result, setResult] = useState<{ time: string; space: string; explanation?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'static' | 'ai'>('static');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'explanation' | 'tips' | 'raw'>('summary');
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    setActiveTab('summary');
    try {
      if (mode === 'static') {
        const res = estimateComplexity(code, language);
        setResult(res);
      } else {
        const res = await analyzeWithOpenAI(code, language);
        setResult(res);
      }
    } catch (e: any) {
      setError('Failed to analyze code.');
    } finally {
      setLoading(false);
    }
  };

  const accent = {
    base: 'purple',
    text: 'text-purple-500 dark:text-purple-400',
    ring: 'focus:ring-purple-500 dark:focus:ring-purple-400',
    bgStrong: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600',
    gradient: 'from-purple-500/20',
  };

  const classified = result ? classifyComplexity(result.time) : null;
  const tips = result ? optimizationTips(result.time, result.space) : [];

  const codeStats = useMemo(() => {
    if (!code) return { lines: 0, chars: 0, avgLine: 0 };
    const lines = code.replace(/\n+$/, '').split(/\n/).length;
    const chars = code.length;
    const avgLine = lines ? Math.round(chars / lines) : 0;
    return { lines, chars, avgLine };
  }, [code]);

  function buildSummary() {
    if (!result) return '';
    return `Time Complexity: ${result.time}\nSpace Complexity: ${result.space}\nClassification: ${classified?.label || 'N/A'}\nLines: ${codeStats.lines}\nCharacters: ${codeStats.chars}`;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { }
  };

  const handleDownload = () => {
    if (!result) return;
    const payload = {
      time: result.time,
      space: result.space,
      classification: classified?.label,
      description: classified?.desc,
      tips,
      language,
      code,
      generatedAt: new Date().toISOString(),
      mode,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 pt-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-20 pb-10">
          <div className="flex justify-center">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-tr ${accent.gradient} via-fuchsia-400/10 to-transparent rounded-full blur-xl animate-pulse`}></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <Code2 className={`w-8 h-8 text-blue-500`} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
              Code Analyzer
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Estimate time and space complexity of your algorithms with precision
            </p>

            <div className="flex justify-center gap-8 text-sm text-gray-500 dark:text-gray-500 pt-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                <span>Fast Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className={`w-4 h-4 ${accent.text}`} />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span>Accurate Results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Analyzer Card */}
        <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl p-8 space-y-8 hover:bg-white/80 dark:hover:bg-gray-800/60 transition-all duration-300">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label htmlFor="language" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Code2 className="w-4 h-4" />
                Programming Language
              </label>
              <div className="relative">
                <select
                  id="language"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className={`w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${accent.ring} focus:border-transparent backdrop-blur-sm appearance-none cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/70 shadow-sm dark:shadow-none`}
                >
                  {languages.map(l => (
                    <option key={l.value} value={l.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{l.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="mode" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {mode === 'static' ? <Zap className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                Analysis Mode
              </label>
              <div className="relative">
                <select
                  id="mode"
                  value={mode}
                  onChange={e => setMode(e.target.value as 'static' | 'ai')}
                  className={`w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${accent.ring} focus:border-transparent backdrop-blur-sm appearance-none cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/70 shadow-sm dark:shadow-none`}
                >
                  <option value="static" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">⚡ Heuristics (Fast)</option>
                  <option value="ai" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">🧠 AI Analysis (Best Quality)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Code Input */}
          <div className="space-y-3">
            <label htmlFor="code" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Code2 className="w-4 h-4" />
              Your Code
            </label>
            <div className="relative">
              <textarea
                id="code"
                value={code}
                onChange={e => setCode(e.target.value)}
                rows={16}
                className="w-full bg-gray-50 dark:bg-gray-900/80 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent backdrop-blur-sm min-h-[400px] transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-900/90 placeholder-gray-500 dark:placeholder-gray-400/80 resize-none shadow-sm dark:shadow-none"
                placeholder="// Paste your code here and discover its complexity...
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;
}"
              />
            </div>
          </div>

          {/* Analyze Button */}
          <div className="flex justify-center" aria-live="polite" aria-busy={loading}>
            <button
              onClick={handleAnalyze}
              className={`group relative inline-flex items-center justify-center ${accent.bgStrong} text-white font-semibold h-12 px-8 py-3 rounded-lg text-base ring-offset-background transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl min-w-[200px]`}
              disabled={loading || !code.trim()}
            >
              <div className="flex items-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="sr-only">Analyzing code</span>
                    <span aria-hidden="true">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    <span>Analyze Code</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div role="alert" className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-300 p-6 rounded-xl backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 dark:bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center">
                <Gauge className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Results</h2>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={handleCopy} className="text-xs px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition-colors" aria-label="Copy summary">
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button onClick={handleDownload} className="text-xs px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition-colors" aria-label="Download analysis JSON">
                  Export JSON
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Time Complexity */}
              <div className="bg-purple-50/50 dark:bg-gray-700/30 border border-purple-200/50 dark:border-gray-600/50 rounded-lg p-6 hover:bg-purple-50/80 dark:hover:bg-gray-700/50 transition-all duration-300 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-3">
                  <Timer className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Time Complexity</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono mb-2">
                  {result?.time}
                </p>
                {classified && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-medium tracking-wide bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 text-gray-700 dark:text-gray-300`}>{classified.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{classified.desc}</span>
                  </div>
                )}
              </div>

              {/* Space Complexity */}
              <div className="bg-green-50/50 dark:bg-gray-700/30 border border-green-200/50 dark:border-gray-600/50 rounded-lg p-6 hover:bg-green-50/80 dark:hover:bg-gray-700/50 transition-all duration-300 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-6 h-6 text-green-500 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Space Complexity</h3>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 font-mono">
                  {result?.space}
                </p>
              </div>

              {/* Code Metrics */}
              <div className="bg-gray-50/70 dark:bg-gray-700/30 border border-gray-200/60 dark:border-gray-600/50 rounded-lg p-6 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-300 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Code Metrics</h3>
                </div>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 font-mono">
                  <li>Lines: <span className="font-semibold">{codeStats.lines}</span></li>
                  <li>Characters: <span className="font-semibold">{codeStats.chars}</span></li>
                  <li>Avg/Line: <span className="font-semibold">{codeStats.avgLine}</span></li>
                </ul>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-2">
              <div role="tablist" aria-label="Analysis detail tabs" className="flex flex-wrap gap-2 mb-4">
                {[
                  { id: 'summary', label: 'Summary' },
                  { id: 'explanation', label: 'Explanation', disabled: !result?.explanation },
                  { id: 'tips', label: 'Tips', disabled: tips.length === 0 },
                  { id: 'raw', label: 'Raw JSON' },
                ].map(t => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={activeTab === t.id}
                    aria-controls={`panel-${t.id}`}
                    disabled={t.disabled}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400 ${activeTab === t.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Panels */}
              <div className="mt-2">
                {activeTab === 'summary' && (
                  <div id="panel-summary" role="tabpanel" className="space-y-4">
                    {classified && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Relative computational cost across common complexity classes.</p>
                        <div className="h-4 rounded-full bg-gray-200/60 dark:bg-gray-700/60 overflow-hidden flex" aria-label="Complexity cost scale">
                          {complexityScale.map(c => (
                            <div
                              key={c.label}
                              className={`h-full transition-all duration-500 ${c.color} ${c.label === classified.label ? 'opacity-100' : 'opacity-25 dark:opacity-15'}`}
                              style={{ width: `${100 / complexityScale.length}%` }}
                              title={c.label}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-500">
                          <span>Best</span>
                          <span>Worst</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'explanation' && result?.explanation && (
                  <div id="panel-explanation" role="tabpanel" className="space-y-4">
                    <div className="bg-gray-100/60 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-700/60 rounded-md p-4">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">{result.explanation}</pre>
                    </div>
                  </div>
                )}
                {activeTab === 'tips' && (
                  <div id="panel-tips" role="tabpanel" className="space-y-4">
                    {tips.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {tips.map((t, i) => (<li key={i}>{t}</li>))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No optimization tips generated.</p>
                    )}
                  </div>
                )}
                {activeTab === 'raw' && (
                  <div id="panel-raw" role="tabpanel" className="space-y-4">
                    <div className="relative">
                      <textarea readOnly className="w-full font-mono text-xs rounded-md bg-gray-900/90 text-gray-100 p-4 border border-gray-700 min-h-[200px]" value={JSON.stringify({ time: result?.time, space: result?.space, classification: classified?.label, desc: classified?.desc, tips, language, mode }, null, 2)} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Deprecated standalone explanation & tips replaced by tabs */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeAnalyzerPage;