import React, { useState } from 'react';
import UserListSidebar from '../components/user/UserListSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import ProfileSettingsModal from '../components/profile/ProfileSettingsModal';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle } from 'lucide-react';

export default function ChatPage({ currentUser, onUpdateProfile }) {
  const { logout } = useAuth();
  const [activeUser, setActiveUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  // Mock users data
  const users = [
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: false,
      lastSeen: '2 hours ago',
    },
    {
      id: '3',
      name: 'Carol Wilson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: true,
    },
    {
      id: '4',
      name: 'David Brown',
      online: false,
      lastSeen: '1 day ago',
    },
  ];

  // Mock messages data
  const mockMessages = {
    '1': [
      {
        id: '1',
        content: 'Hey! How are you doing?',
        sender: { id: '1', name: 'Alice Johnson', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
        timestamp: '10:30 AM',
        isOwn: false,
      },
      {
        id: '2',
        content: 'I\'m doing great! Thanks for asking. How about you?',
        sender: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
        timestamp: '10:32 AM',
        isOwn: true,
      },
      {
        id: '3',
        content: 'That\'s wonderful to hear! I\'m doing well too. Working on some exciting projects.',
        sender: { id: '1', name: 'Alice Johnson', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
        timestamp: '10:35 AM',
        isOwn: false,
      },
    ],
    '2': [
      {
        id: '4',
        content: 'Good morning!',
        sender: { id: '2', name: 'Bob Smith', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100' },
        timestamp: '9:00 AM',
        isOwn: false,
      },
    ],
  };

  const handleUserClick = (user) => {
    setActiveUser(user);
    setMessages(mockMessages[user.id] || []);
  };

  const handleSendMessage = (content) => {
    if (!activeUser) return;

    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };

    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <UserListSidebar
        users={users}
        activeUser={activeUser}
        onUserClick={handleUserClick}
        onSettingsClick={() => setIsProfileModalOpen(true)}
        onLogout={logout}
        currentUser={currentUser}
      />
      
      {activeUser ? (
        <ChatWindow
          user={activeUser}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to ChatApp
            </h3>
            <p className="text-gray-500">
              Select a conversation to start chatting
            </p>
          </div>
        </div>
      )}

      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={{ ...currentUser, email: currentUser.email || 'user@example.com' }}
        onUpdateProfile={onUpdateProfile}
      />
    </div>
  );
}