import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import UserAvatar from '../user/UserAvatar';
import Button from '../ui/Button';

export default function ProfilePictureUploader({ currentAvatar, username, onUpload }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <UserAvatar
          src={currentAvatar}
          alt={username}
          size="lg"
        />
        <button
          onClick={handleClick}
          className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        variant="secondary"
        onClick={handleClick}
      >
        Change Profile Picture
      </Button>
    </div>
  );
}