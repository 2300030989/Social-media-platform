import React from 'react';
import { Bell, Heart, MessageCircle, UserPlus, X, Check } from 'lucide-react';

const NotificationDropdown = ({ 
  notifications, 
  users, 
  posts, 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setCurrentPage,
  onClose 
}) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  const getPostById = (postId) => {
    return posts.find(post => post.id === postId);
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    
    if (notification.type === 'message' || notification.type === 'follow') {
      setCurrentPage('messages');
    } else if (notification.postId) {
      setCurrentPage('home');
    }
    
    onClose();
  };

  const handleMessageUser = (userId) => {
    setCurrentPage('messages');
    onClose();
  };

  return (
    <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <div className="flex items-center space-x-2">
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1"
            >
              <Check className="w-3 h-3" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const fromUser = getUserById(notification.fromUserId);
            const post = notification.postId ? getPostById(notification.postId) : null;
            
            return (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {fromUser && (
                      <img
                        src={fromUser.avatar}
                        alt={fromUser.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getNotificationIcon(notification.type)}
                      <span className="text-sm font-medium text-gray-900">
                        {fromUser?.displayName || 'Unknown User'}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {notification.timestamp}
                      </span>
                      
                      <div className="flex space-x-2">
                        {notification.type === 'follow' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMessageUser(notification.fromUserId);
                            }}
                            className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                          >
                            Message
                          </button>
                        )}
                        
                        {notification.postId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notification);
                            }}
                            className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                          >
                            View Post
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;