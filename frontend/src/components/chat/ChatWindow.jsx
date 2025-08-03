import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatWindow({ user, messages, onSendMessage }) {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader user={user} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}