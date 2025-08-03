import React from 'react';
import UserAvatar from './UserAvatar';

export default function UserListItem({ user, onClick, active = false }) {
  return (
    <div
      onClick={() => onClick(user)}
      className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors hover:bg-gray-50 ${
        active ? 'bg-blue-50 border-r-2 border-blue-500' : ''
      }`}
    >
      <UserAvatar
        src={user.avatar}
        alt={user.name}
        online={user.online}
        size="md"
      />
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">{user.name}</p>
        <p className="text-xs text-gray-500">
          {user.online ? 'Online' : `Last seen ${user.lastSeen}`}
        </p>
      </div>
    </div>
  );
}