import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import Button from '../ui/Button';

export default function UsernameEditor({ currentUsername, onSave, onCancel }) {
  const [username, setUsername] = useState(currentUsername);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && username !== currentUsername) {
      onSave(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your username"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!username.trim() || username === currentUsername}
        >
          <Check className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </form>
  );
}