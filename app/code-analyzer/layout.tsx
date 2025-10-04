
"use client";
import React from 'react';

export default function CodeAnalyzerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.1) 2px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-gray-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-50"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}