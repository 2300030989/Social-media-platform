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
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

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
        loadConversations();
        generateNotifications();
        addDummyAccounts();
      })();
    }
  }, [currentUser]);

  // Load posts when users are available
  useEffect(() => {
    if (currentUser && users.length > 0) {
      loadPosts();
    }
  }, [currentUser, users]);

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
    
    // Add some dummy posts with images
    const dummyPosts = [
      {
        id: 9999,
        userId: 999,
        authorEmail: 'rahul@example.com',
        content: 'Just finished building an amazing React component! 🚀 The new hooks are incredible.',
        hashtags: ['react', 'javascript', 'webdev'],
        timestamp: '2 hours ago',
        likes: 24,
        comments: 5,
        likedBy: [],
        mediaUrls: ['https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'],
        mediaData: null,
        mediaType: null
      },
      {
        id: 9998,
        userId: 998,
        authorEmail: 'praveen@example.com',
        content: 'Working on a new project with Node.js and MongoDB. Excited to share the results soon! 💻',
        hashtags: ['nodejs', 'mongodb', 'backend'],
        timestamp: '4 hours ago',
        likes: 18,
        comments: 3,
        likedBy: [],
        mediaUrls: ['https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'],
        mediaData: null,
        mediaType: null
      },
      {
        id: 9997,
        userId: 997,
        authorEmail: 'sarah@example.com',
        content: 'New design system is ready! Clean, modern, and accessible. What do you think? ✨',
        hashtags: ['design', 'ui', 'ux'],
        timestamp: '6 hours ago',
        likes: 42,
        comments: 8,
        likedBy: [],
        mediaUrls: ['https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400'],
        mediaData: null,
        mediaType: null
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
    setIsLoadingPosts(true);
    try {
      const backendPosts = await postsAPI.getAllPosts();
      console.log('Loaded backend posts:', backendPosts);
      
      // Map backend posts to frontend format
      const mappedPosts = (backendPosts || []).map(p => {
        const user = users.find(u => u.email === p.authorEmail);
        return {
        id: p.id,
          userId: user?.id || null,
        authorEmail: p.authorEmail,
        content: p.content,
        hashtags: p.hashtags || [],
          mediaData: p.mediaData,
          mediaType: p.mediaType,
        mediaUrls: p.mediaUrls || [],
          likes: p.likes || 0,
          comments: p.comments || 0,
        likedBy: [],
          timestamp: p.createdAt ? new Date(p.createdAt).toLocaleString() : 'now',
          createdAt: p.createdAt ? new Date(p.createdAt) : new Date()
        };
      });
      
      // Sort posts by creation date (newest first)
      const sortedPosts = mappedPosts.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      console.log('Mapped posts:', sortedPosts);
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Failed to load posts from backend, using dummy data:', error);
      // Use dummy posts with images when backend is not available
      const dummyPostsWithImages = [
        {
          id: 9999,
          userId: 999,
          authorEmail: 'rahul@example.com',
          content: 'Just finished building an amazing React component! 🚀 The new hooks are incredible.',
          hashtags: ['react', 'javascript', 'webdev'],
          timestamp: '2 hours ago',
          likes: 24,
          comments: 5,
          likedBy: [],
          mediaUrls: ['https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'],
          mediaData: null,
          mediaType: null,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          id: 9998,
          userId: 998,
          authorEmail: 'praveen@example.com',
          content: 'Working on a new project with Node.js and MongoDB. Excited to share the results soon! 💻',
          hashtags: ['nodejs', 'mongodb', 'backend'],
          timestamp: '4 hours ago',
          likes: 18,
          comments: 3,
          likedBy: [],
          mediaUrls: ['https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'],
          mediaData: null,
          mediaType: null,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        },
        {
          id: 9997,
          userId: 997,
          authorEmail: 'sarah@example.com',
          content: 'New design system is ready! Clean, modern, and accessible. What do you think? ✨',
          hashtags: ['design', 'ui', 'ux'],
          timestamp: '6 hours ago',
          likes: 42,
          comments: 8,
          likedBy: [],
          mediaUrls: ['https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400'],
          mediaData: null,
          mediaType: null,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        }
      ];
      
      // Sort dummy posts by creation date (newest first)
      const sortedDummyPosts = dummyPostsWithImages.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setPosts(sortedDummyPosts);
    } finally {
      setIsLoadingPosts(false);
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
      const payload = { 
        content: newPost.content, 
        authorEmail: currentUser.email,
        hashtags: newPost.hashtags || []
      };
      
      // Add media data if present
      if (newPost.media && newPost.media.length > 0) {
        const media = newPost.media[0]; // Take first media item
        if (typeof media === 'string' && media.startsWith('data:')) {
          const [header, data] = media.split(',');
          payload.mediaData = data;
          payload.mediaType = header.split(';')[0].split(':')[1];
        } else if (media.type && media.url) {
          payload.mediaData = media.url;
          payload.mediaType = media.type;
        }
      }
      
      const created = await postsAPI.createPost(payload);
      console.log('Created post:', created);
      
      // Refresh posts to show the new post
      await loadPosts();
    } catch (error) {
      console.error('Failed to create post, adding locally:', error);
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
        mediaUrls: newPost.mediaUrls || (newPost.media ? newPost.media.map(m => (typeof m === 'string' ? m : m.url)) : []),
        createdAt: new Date()
      };
      setPosts(prev => {
        const updatedPosts = [localPost, ...prev];
        // Sort to maintain chronological order (newest first)
        return updatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
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

  const handleDeletePost = async (postId) => {
    try {
      await postsAPI.deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
      // Optionally show a toast/alert
      alert('You can only delete your own post.');
    }
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
            isLoadingPosts={isLoadingPosts}
            onCreatePost={handleCreatePost}
            onLikePost={handleLikePost}
            onBookmarkPost={handleBookmarkPost}
            bookmarkedPosts={bookmarkedPosts}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
            onDeletePost={handleDeletePost}
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
            onDeletePost={handleDeletePost}
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
            onDeletePost={handleDeletePost}
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
            isLoadingPosts={isLoadingPosts}
            onCreatePost={handleCreatePost}
            onLikePost={handleLikePost}
            onBookmarkPost={handleBookmarkPost}
            bookmarkedPosts={bookmarkedPosts}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
            onDeletePost={handleDeletePost}
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