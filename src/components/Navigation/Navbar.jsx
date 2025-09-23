import React, { useState, useRef, useEffect } from 'react';
import { Home, Search, Bell, Mail, User, LogOut, Settings, Bookmark } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import SearchDropdown from './SearchDropdown';

const Navbar = ({ 
  currentUser, 
  currentPage, 
  setCurrentPage, 
  notifications, 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  users, 
  posts, 
  onLogout 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'messages', icon: Mail, label: 'Messages' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Navigation Items */}
      <div className="flex-1 flex flex-col items-center py-6 space-y-4">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-3 rounded-xl hover:bg-gray-100 transition-colors group relative"
            title="Search"
          >
            <Search className="w-6 h-6 text-gray-600 group-hover:text-purple-600" />
          </button>
          
          {showSearch && (
            <SearchDropdown
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              users={users}
              posts={posts}
              setCurrentPage={setCurrentPage}
              onClose={() => setShowSearch(false)}
            />
          )}
        </div>

        {/* Navigation Links */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`p-3 rounded-xl transition-colors group relative ${
              currentPage === item.id
                ? 'bg-purple-100 text-purple-600'
                : 'hover:bg-gray-100 text-gray-600 hover:text-purple-600'
            }`}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 rounded-xl hover:bg-gray-100 transition-colors group relative"
            title="Notifications"
          >
            <Bell className="w-6 h-6 text-gray-600 group-hover:text-purple-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationDropdown
              notifications={notifications}
              users={users}
              posts={posts}
              markNotificationAsRead={markNotificationAsRead}
              markAllNotificationsAsRead={markAllNotificationsAsRead}
              setCurrentPage={setCurrentPage}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>
      </div>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-200" ref={userMenuRef}>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-12 h-12 rounded-full overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
            title="User Menu"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-full h-full object-cover"
            />
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{currentUser.displayName}</p>
                <p className="text-sm text-gray-500">@{currentUser.username}</p>
              </div>
              
              <button
                onClick={() => {
                  setCurrentPage('profile');
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => {
                  setCurrentPage('settings');
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <hr className="my-1" />
              
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;