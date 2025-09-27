import React, { useState, useEffect } from 'react';
import { Search, User, Hash, FileText, X } from 'lucide-react';

const SearchDropdown = ({ 
  searchQuery, 
  setSearchQuery, 
  users, 
  posts, 
  setCurrentPage, 
  onClose 
}) => {
  const [results, setResults] = useState({
    users: [],
    posts: [],
    hashtags: []
  });

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ users: [], posts: [], hashtags: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Search users
    const userResults = users.filter(user => 
      user.displayName.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query)
    ).slice(0, 5);

    // Search posts
    const postResults = posts.filter(post => 
      post.content.toLowerCase().includes(query) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(query))
    ).slice(0, 5);

    // Extract hashtags
    const allHashtags = posts.flatMap(post => post.hashtags);
    const hashtagResults = [...new Set(allHashtags)]
      .filter(tag => tag.toLowerCase().includes(query))
      .slice(0, 5);

    setResults({
      users: userResults,
      posts: postResults,
      hashtags: hashtagResults
    });
  }, [searchQuery, users, posts]);

  const handleUserClick = (user) => {
    setCurrentPage('profile');
    onClose();
  };

  const handlePostClick = (post) => {
    setCurrentPage('home');
    onClose();
  };

  const handleHashtagClick = (hashtag) => {
    setSearchQuery(`#${hashtag}`);
    setCurrentPage('home');
    onClose();
  };

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  const hasResults = results.users.length > 0 || results.posts.length > 0 || results.hashtags.length > 0;

  return (
    <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden">
      {/* Search Input */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people, posts, hashtags..."
            className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-h-80 overflow-y-auto">
        {!searchQuery.trim() ? (
          <div className="p-8 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Start typing to search</p>
          </div>
        ) : !hasResults ? (
          <div className="p-8 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No results found</p>
          </div>
        ) : (
          <div className="py-2">
            {/* Users */}
            {results.users.length > 0 && (
              <div className="mb-4">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                  People
                </div>
                {results.users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 text-left"
                  >
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {user.displayName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        @{user.username}
                      </p>
                    </div>
                    <User className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Posts */}
            {results.posts.length > 0 && (
              <div className="mb-4">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                  Posts
                </div>
                {results.posts.map((post) => {
                  const author = getUserById(post.userId);
                  return (
                    <button
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="w-full px-4 py-3 hover:bg-gray-50 flex items-start space-x-3 text-left"
                    >
                      <img
                        src={author?.avatar}
                        alt={author?.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {author?.displayName}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {post.content}
                        </p>
                      </div>
                      <FileText className="w-4 h-4 text-gray-400 mt-1" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Hashtags */}
            {results.hashtags.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                  Hashtags
                </div>
                {results.hashtags.map((hashtag) => (
                  <button
                    key={hashtag}
                    onClick={() => handleHashtagClick(hashtag)}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 text-left"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Hash className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        #{hashtag}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;