import React from 'react';
import { Heart, MessageCircle, Bookmark, Share, MoreHorizontal } from 'lucide-react';

const BookmarksPage = ({ 
  currentUser, 
  users, 
  posts, 
  onLikePost, 
  onBookmarkPost,
  bookmarkedPosts 
}) => {
  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  const isBookmarked = (postId) => {
    return bookmarkedPosts.includes(postId);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bookmarks</h1>
        <p className="text-gray-600">Posts you've saved for later</p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
          <p className="text-gray-500">
            When you bookmark posts, they'll appear here so you can easily find them later.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const author = getUserById(post.userId);
            if (!author) return null;

            return (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={author.avatar}
                      alt={author.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{author.displayName}</h3>
                      <p className="text-sm text-gray-500">@{author.username} • {post.timestamp}</p>
                    </div>
                  </div>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-900 mb-3">{post.content}</p>
                  
                  {/* Hashtags */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.hashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          className="text-purple-600 hover:text-purple-700 cursor-pointer text-sm"
                        >
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Media */}
                {((post.media && post.media.length > 0) || (post.mediaUrls && post.mediaUrls.length > 0)) && (
                  <div className="px-4 pb-3">
                    <div className="grid grid-cols-1 gap-2">
                      {(post.mediaUrls || post.media || []).map((media, index) => (
                        <div key={media.id || index} className="rounded-lg overflow-hidden">
                          {(typeof media === 'string' ? media.startsWith('data:image') : media.type === 'image') ? (
                            <img
                              src={typeof media === 'string' ? media : media.url}
                              alt="Post media"
                              className="w-full h-auto max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                              onClick={() => {
                                const newWindow = window.open();
                                newWindow.document.write(`<img src="${typeof media === 'string' ? media : media.url}" style="max-width:100%;height:auto;" />`);
                              }}
                            />
                          ) : (
                            <video
                              src={typeof media === 'string' ? media : media.url}
                              className="w-full h-auto max-h-96 object-cover"
                              controls
                              preload="metadata"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => onLikePost(post.id)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{post.likes || 0}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                        <Share className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => onBookmarkPost(post.id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        isBookmarked(post.id)
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-500 hover:text-yellow-500'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked(post.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;