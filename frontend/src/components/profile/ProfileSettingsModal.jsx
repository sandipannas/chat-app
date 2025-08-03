import React, { useState } from 'react';
import Modal from '../ui/Modal';
import ProfilePictureUploader from './ProfilePictureUploader';
import UsernameEditor from './UsernameEditor';

export default function ProfileSettingsModal({ isOpen, onClose, user, onUpdateProfile }) {
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const handleUsernameChange = (newUsername) => {
    onUpdateProfile({ name: newUsername });
    setIsEditingUsername(false);
  };

  const handleAvatarUpload = (file) => {
    // In a real app, you'd upload to a server and get back a URL
    const fakeUrl = URL.createObjectURL(file);
    onUpdateProfile({ avatar: fakeUrl });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile Settings" size="md">
      <div className="space-y-6">
        <ProfilePictureUploader
          currentAvatar={user.avatar}
          username={user.name}
          onUpload={handleAvatarUpload}
        />
        
        <div className="border-t pt-6">
          {isEditingUsername ? (
            <UsernameEditor
              currentUsername={user.name}
              onSave={handleUsernameChange}
              onCancel={() => setIsEditingUsername(false)}
            />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <button
                onClick={() => setIsEditingUsername(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        
        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
      </div>
    </Modal>
  );
}