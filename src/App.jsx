import React, { useState, useEffect } from 'react';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import Navbar from './components/Navigation/Navbar';
import HomePage from './components/Feed/HomePage';
import ProfilePage from './components/Profile/ProfilePage';
import MessagesPage from './components/Messages/MessagesPage';
import BookmarksPage from './components/Bookmarks/BookmarksPage';
import SettingsPage from './components/Settings/SettingsPage';
import { authAPI, usersAPI, messagesAPI, postsAPI } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [authMode, setAuthMode] = useState('login');
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]); // Keep for dummy posts
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());

  // Check for existing auth token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      loadCurrentUser();
    }
  }, []);

  // Load data when user is authenticated
  useEffect(() => {
    if (currentUser) {
      (async () => {
        await loadUsers();
        await loadPosts();
        loadConversations();
        generateNotifications();
        addDummyAccounts();
      })();
    }
  }, [currentUser]);

  const addDummyAccounts = () => {
    const dummyUsers = [
      {
        id: 999,
        username: 'rahul_dev',
        displayName: 'Rahul Kumar',
        email: 'rahul@example.com',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'Full Stack Developer | React Enthusiast',
        location: 'Mumbai, India',
        followers: 245,
        following: []
      },
      {
        id: 998,
        username: 'praveen_tech',
        displayName: 'Praveen Singh',
        email: 'praveen@example.com',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'Software Engineer | Tech Blogger',
        location: 'Bangalore, India',
        followers: 189,
        following: []
      },
      {
        id: 997,
        username: 'sarah_design',
        displayName: 'Sarah Wilson',
        email: 'sarah@example.com',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'UI/UX Designer | Creative Mind',
        location: 'New York, USA',
        followers: 312,
        following: []
      }
    ];
    
    setUsers(prev => {
      const existingIds = prev.map(u => u.id);
      const newUsers = dummyUsers.filter(u => !existingIds.includes(u.id));
      return [...prev, ...newUsers];
    });
    
    // Add some dummy posts
    const dummyPosts = [
      {
        id: 9999,
        userId: 999,
        content: 'Just finished building an amazing React component! 🚀 The new hooks are incredible.',
        hashtags: ['react', 'javascript', 'webdev'],
        timestamp: '2 hours ago',
        likes: 24,
        comments: 5,
        likedBy: [],
        mediaUrls: []
      },
      {
        id: 9998,
        userId: 998,
        content: 'Working on a new project with Node.js and MongoDB. Excited to share the results soon! 💻',
        hashtags: ['nodejs', 'mongodb', 'backend'],
        timestamp: '4 hours ago',
        likes: 18,
        comments: 3,
        likedBy: [],
        mediaUrls: []
      },
      {
        id: 9997,
        userId: 997,
        content: 'New design system is ready! Clean, modern, and accessible. What do you think? ✨',
        hashtags: ['design', 'ui', 'ux'],
        timestamp: '6 hours ago',
        likes: 42,
        comments: 8,
        likedBy: [],
        mediaUrls: []
      }
    ];
    
    setPosts(prev => {
      const existingIds = prev.map(p => p.id);
      const newPosts = dummyPosts.filter(p => !existingIds.includes(p.id));
      return [...newPosts, ...prev];
    });
  };
  const loadCurrentUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found');
        return;
      }
      
      console.log('Loading current user...');
      const userData = await authAPI.getCurrentUser();
      console.log('Current user loaded:', userData);
      setCurrentUser(userData);
    } catch (error) {
      console.error('Failed to load current user:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await usersAPI.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const backendPosts = await postsAPI.getAllPosts();
      setPosts((backendPosts || []).map(p => ({
        id: p.id,
        userId: users.find(u => u.email === p.authorEmail)?.id,
        authorEmail: p.authorEmail,
        content: p.content,
        hashtags: p.hashtags || [],
        mediaUrls: p.mediaUrls || [],
        likes: 0,
        comments: 0,
        likedBy: [],
        timestamp: 'now'
      })));
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };


  const loadConversations = async () => {
    try {
      const conversationsData = await messagesAPI.getAllConversations();
      if (conversationsData.conversations) {
        const convMap = {};
        conversationsData.conversations.forEach(conv => {
          convMap[conv.partner.id] = conv.messages || [];
        });
        setConversations(convMap);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const generateNotifications = () => {
    const sampleNotifications = [
      {
        id: 1,
        type: 'like',
        fromUserId: 2,
        message: 'liked your post',
        timestamp: '2 minutes ago',
        read: false,
        postId: 1
      },
      {
        id: 2,
        type: 'follow',
        fromUserId: 3,
        message: 'started following you',
        timestamp: '1 hour ago',
        read: false
      },
      {
        id: 3,
        type: 'comment',
        fromUserId: 4,
        message: 'commented on your post',
        timestamp: '3 hours ago',
        read: true,
        postId: 2
      }
    ];
    setNotifications(sampleNotifications);
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData.user);
    localStorage.setItem('authToken', userData.token);
  };

  const handleSignup = (userData) => {
    setCurrentUser(userData.user);
    localStorage.setItem('authToken', userData.token);
  };

  const handleLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
    setCurrentPage('home');
    setUsers([]);
    setPosts([]);
    setNotifications([]);
    setMessages([]);
    setConversations({});
    setBookmarkedPosts([]);
  };

  const handleCreatePost = async (newPost) => {
    try {
      const payload = { content: newPost.content, authorEmail: currentUser.email };
      const created = await postsAPI.createPost(payload);
      // Refresh list to reflect persisted posts for everyone
      await loadPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      // Fallback to local append so user sees it immediately
      const localPost = {
        ...newPost,
        id: Date.now(),
        userId: currentUser.id,
        authorEmail: currentUser.email,
        timestamp: 'now',
        likes: 0,
        comments: 0,
        likedBy: [],
        mediaUrls: newPost.media ? newPost.media.map(m => (typeof m === 'string' ? m : m.url)) : []
      };
      setPosts(prev => [localPost, ...prev]);
    }
  };

  const handleLikePost = (postId) => {
    const isLiked = likedPosts.has(postId);
    
    // Update UI immediately
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    
    // Update posts array
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: isLiked ? Math.max(0, (post.likes || 0) - 1) : (post.likes || 0) + 1,
          likedBy: isLiked 
            ? (post.likedBy || []).filter(id => id !== currentUser.id)
            : [...(post.likedBy || []), currentUser.id]
        };
      }
      return post;
    }));
    
    // Only local updates now
  };

  const handleBookmarkPost = (postId) => {
    setBookmarkedPosts(prev => {
      const isBookmarked = prev.includes(postId);
      if (isBookmarked) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  const handleSendMessage = async (recipientId, messageText) => {
    try {
      const message = await messagesAPI.sendMessage({
        recipientId: recipientId.toString(),
        content: messageText
      });
      
      // Update conversations
      setConversations(prev => ({
        ...prev,
        [recipientId]: [...(prev[recipientId] || []), message]
      }));
      
      return message;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const handleFollowUser = async (userEmail) => {
    try {
      await usersAPI.followUser(userEmail);
      
      // Find user by email
      const user = users.find(u => u.email === userEmail);
      if (!user) return;
      
      // Update users list
      setUsers(prev => prev.map(user => 
        user.email === userEmail 
          ? { ...user, followers: user.followers + 1 }
          : user
      ));
      
      // Update current user's following list
      setCurrentUser(prev => ({
        ...prev,
        following: [...(prev.following || []), user.id]
      }));
      
      // Add notification
      const newNotification = {
        id: Date.now(),
        type: 'follow',
        fromUserId: currentUser.id,
        message: 'started following you',
        timestamp: 'now',
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollowUser = async (userEmail) => {
    try {
      await usersAPI.unfollowUser(userEmail);
      
      // Find user by email
      const user = users.find(u => u.email === userEmail);
      if (!user) return;
      
      // Update users list
      setUsers(prev => prev.map(user => 
        user.email === userEmail 
          ? { ...user, followers: Math.max(0, user.followers - 1) }
          : user
      ));
      
      // Update current user's following list
      setCurrentUser(prev => ({
        ...prev,
        following: (prev.following || []).filter(id => id !== user.id)
      }));
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      // Update locally first
      const updatedUser = { ...currentUser, ...updatedData };
      setCurrentUser(updatedUser);
      
      // Try to update on backend
      try {
        const backendUser = await usersAPI.updateUser(currentUser.id, updatedData);
        setCurrentUser(backendUser);
        setUsers(prev => prev.map(user => 
          user.email === currentUser.email ? backendUser : user
        ));
      } catch (backendError) {
        console.error('Backend update failed, keeping local changes:', backendError);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  // If not logged in, show auth pages
  if (!currentUser) {
    return authMode === 'login' ? (
      <LoginPage 
        onLogin={handleLogin}
        switchToSignup={() => setAuthMode('signup')}
      />
    ) : (
      <SignupPage 
        onSignup={handleSignup}
        switchToLogin={() => setAuthMode('login')}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            currentUser={currentUser}
            users={users}
            posts={posts}
            onCreatePost={handleCreatePost}
            onLikePost={handleLikePost}
            onBookmarkPost={handleBookmarkPost}
            bookmarkedPosts={bookmarkedPosts}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            currentUser={currentUser}
            users={users}
            posts={posts}
            onUpdateProfile={handleUpdateProfile}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'messages':
        return (
          <MessagesPage
            currentUser={currentUser}
            users={users}
            messages={messages}
            onSendMessage={handleSendMessage}
            conversations={conversations}
          />
        );
      case 'bookmarks':
        const bookmarkedPostsData = posts.filter(post => bookmarkedPosts.includes(post.id));
        return (
          <BookmarksPage
            currentUser={currentUser}
            users={users}
            posts={bookmarkedPostsData}
            onLikePost={handleLikePost}
            onBookmarkPost={handleBookmarkPost}
            bookmarkedPosts={bookmarkedPosts}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <HomePage
            currentUser={currentUser}
            users={users}
            posts={posts}
            onCreatePost={handleCreatePost}
            onLikePost={handleLikePost}
            onBookmarkPost={handleBookmarkPost}
            bookmarkedPosts={bookmarkedPosts}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Left-side Navbar */}
      <Navbar
        currentUser={currentUser}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        markAllNotificationsAsRead={markAllNotificationsAsRead}
        users={users}
        posts={posts}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="pl-24 p-6">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;