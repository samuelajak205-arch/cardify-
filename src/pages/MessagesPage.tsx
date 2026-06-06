import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, User } from 'lucide-react';

type Message = { id: number; sender: string; content: string; role: string };

export default function MessagesPage() {
  const { role } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Admin', content: 'Welcome to the system!', role: 'admin' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      sender: 'Me', 
      content: newMessage, 
      role: role || 'user' 
    }]);
    setNewMessage('');
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 overflow-y-auto mb-4">
        {messages.map(msg => (
          <div key={msg.id} className="mb-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              <User size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 capitalize">{msg.sender} ({msg.role})</p>
              <p className="bg-gray-100 p-2 rounded-lg">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg p-2"
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Send size={16} /> Send
        </button>
      </div>
    </div>
  );
}
