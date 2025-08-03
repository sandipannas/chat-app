import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import Button from '../ui/Button';

export default function MessageInput({ onSendMessage, disabled = false }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="px-4 py-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}