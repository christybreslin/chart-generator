"use client"

import ChartGenerator from "@/components/chart-generator";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <header className="container mx-auto py-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Chart Generator</h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors">Create beautiful area charts with custom data</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pb-8">
        <ChartGenerator />
      </main>
    </div>
  );
} 