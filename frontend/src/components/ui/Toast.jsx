import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 border rounded-lg shadow-lg ${bgColors[type]} animate-slide-in`}>
      {icons[type]}
      <span className="ml-2 text-sm font-medium text-gray-900">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}