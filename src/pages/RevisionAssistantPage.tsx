import React, { useState } from 'react';
import { Camera, Send } from 'lucide-react';

export default function RevisionAssistantPage() {
    const [topic, setTopic] = useState('');
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Revision Assistant</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-3">Ask about a Topic</h2>
                <div className="flex gap-2 mb-6">
                    <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Newton's laws..." className="flex-1 border rounded-lg p-2" />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Send size={16}/> Ask</button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center gap-3">
                    <Camera size={40} className="text-gray-400" />
                    <p className="text-sm">Or take a picture of a confusing topic</p>
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-lg">Capture Photo</button>
                </div>
            </div>
        </div>
    );
}
