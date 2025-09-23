const API_BASE_URL = 'http://localhost:8081/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Create axios-like request function
const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...(options.body && { body: JSON.stringify(options.body) }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: credentials,
      });
      
      if (response.token) {
        setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      console.log('Sending signup request:', userData);
      const response = await apiRequest('/auth/signup', {
        method: 'POST',
        body: userData,
      });
      
      if (response.token) {
        setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Signup API error:', error);
      throw error;
    }
  },

  logout: () => {
    removeAuthToken();
  },

  getCurrentUser: async () => {
    try {
      const token = getAuthToken();
      console.log('Getting current user with token:', token ? 'present' : 'missing');
      return await apiRequest('/auth/me');
    } catch (error) {
      console.error('Get current user API error:', error);
      throw error;
    }
  },
};

// Posts API
export const postsAPI = {
  getAllPosts: async () => {
    try {
      return await apiRequest('/posts');
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      return [];
    }
  },

  createPost: async (postData) => {
    try {
      const response = await apiRequest('/posts', {
        method: 'POST',
        body: postData,
      });
      return response;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  },

  getUserPosts: async (userId) => {
    return await apiRequest(`/posts/user/${userId}`);
  },

  likePost: async (postId) => {
    return await apiRequest(`/posts/${postId}/like`, {
      method: 'POST',
    });
  },

  unlikePost: async (postId) => {
    return await apiRequest(`/posts/${postId}/like`, {
      method: 'DELETE',
    });
  },

  searchPosts: async (query) => {
    return await apiRequest(`/posts/search?query=${encodeURIComponent(query)}`);
  },

  deletePost: async (postId) => {
    return await apiRequest(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },
};

// Messages API
export const messagesAPI = {
  sendMessage: async (messageData) => {
    return await apiRequest('/messages/send', {
      method: 'POST',
      body: messageData,
    });
  },

  getConversation: async (userEmail) => {
    return await apiRequest(`/messages/conversation/${encodeURIComponent(userEmail)}`);
  },

  getAllConversations: async () => {
    return await apiRequest('/messages/conversations');
  },

  markAsRead: async (messageId) => {
    return await apiRequest(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  },

  getUnreadMessages: async () => {
    return await apiRequest('/messages/unread');
  },
};

// Users API
export const usersAPI = {
  getAllUsers: async () => {
    return await apiRequest('/users');
  },

  getUserById: async (userId) => {
    return await apiRequest(`/users/${userId}`);
  },

  updateUser: async (userId, userData) => {
    return await apiRequest(`/users/profile`, {
      method: 'PUT',
      body: userData,
    });
  },

  followUser: async (userEmail) => {
    return await apiRequest(`/users/follow/${encodeURIComponent(userEmail)}`, {
      method: 'POST',
    });
  },

  unfollowUser: async (userEmail) => {
    return await apiRequest(`/users/follow/${encodeURIComponent(userEmail)}`, {
      method: 'DELETE',
    });
  },

  searchUsers: async (query) => {
    return await apiRequest(`/users/search?query=${encodeURIComponent(query)}`);
  },

  getUserByEmail: async (email) => {
    return await apiRequest(`/users/email/${encodeURIComponent(email)}`);
  },
};

export { getAuthToken, setAuthToken, removeAuthToken };