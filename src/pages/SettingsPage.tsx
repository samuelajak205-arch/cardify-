import React, { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Monitor } from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Settings /> Settings</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">App Appearance</h2>
        <div className="space-y-3">
          {[
            { id: 'light', name: 'Light', icon: Sun },
            { id: 'dark', name: 'Dark', icon: Moon },
            { id: 'system', name: 'System', icon: Monitor },
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border ${theme === opt.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
            >
              <span className="flex items-center gap-2"><opt.icon size={18} /> {opt.name}</span>
              {theme === opt.id && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
