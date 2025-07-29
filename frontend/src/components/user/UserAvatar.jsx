import React from 'react';
import { User } from 'lucide-react';

export default function UserAvatar({ src, alt, size = 'md', online, className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm`}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm`}>
          <User className="w-5 h-5 text-gray-500" />
        </div>
      )}
      {online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
}