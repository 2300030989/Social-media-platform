import React from 'react';
import CreatePost from './CreatePost';
import { Heart, MessageCircle, Bookmark, Share, MoreHorizontal } from 'lucide-react';

const HomePage = ({ 
  currentUser, 
  users, 
  posts, 
  onCreatePost, 
  onLikePost, 
  onBookmarkPost, 
  bookmarkedPosts,
  onFollowUser, 
  onUnfollowUser 
}) => {
  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  const isFollowing = (userId) => {
    return (currentUser.following || []).includes(userId);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Create Post */}
      <CreatePost currentUser={currentUser} onCreatePost={onCreatePost} />

      {/* Posts Feed */}
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
                
                <div className="flex items-center space-x-2">
                  {post.userId !== currentUser.id && (
                    <button
                      onClick={() => {
                        const author = getUserById(post.userId);
                        if (author) {
                          isFollowing(post.userId) ? onUnfollowUser(author.email) : onFollowUser(author.email);
                        }
                      }}
                      className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                        isFollowing(post.userId)
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {isFollowing(post.userId) ? 'Following' : 'Follow'}
                    </button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
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
              {(post.mediaUrls && post.mediaUrls.length > 0) && (
                <div className="px-4 pb-3">
                  <div className="grid grid-cols-1 gap-3">
                    {post.mediaUrls.map((mediaUrl, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        {mediaUrl.startsWith('data:image') ? (
                          <img
                            src={mediaUrl}
                            alt="Post media"
                            className="w-full h-auto max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => {
                              // Open image in new tab for full view
                              const newWindow = window.open();
                              newWindow.document.write(`<img src="${mediaUrl}" style="max-width:100%;height:auto;" />`);
                            }}
                          />
                        ) : mediaUrl.startsWith('data:video') ? (
                          <video
                            src={mediaUrl}
                            className="w-full h-auto max-h-96 object-cover"
                            controls
                            preload="metadata"
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Legacy media support for local posts */}
              {(!post.mediaUrls || post.mediaUrls.length === 0) && post.media && post.media.length > 0 && (
                <div className="px-4 pb-3">
                  <div className="grid grid-cols-1 gap-3">
                    {post.media.map((media, index) => (
                      <div key={media.id || index} className="rounded-lg overflow-hidden">
                        {typeof media === 'string' && media.startsWith('data:image') ? (
                          <img
                            src={media}
                            alt="Post media"
                            className="w-full h-auto max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => {
                              const newWindow = window.open();
                              newWindow.document.write(`<img src="${media}" style="max-width:100%;height:auto;" />`);
                            }}
                          />
                        ) : typeof media === 'string' && media.startsWith('data:video') ? (
                          <video
                            src={media}
                            className="w-full h-auto max-h-96 object-cover"
                            controls
                            preload="metadata"
                          />
                        ) : media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt="Post media"
                            className="w-full h-auto max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => {
                              const newWindow = window.open();
                              newWindow.document.write(`<img src="${media.url}" style="max-width:100%;height:auto;" />`);
                            }}
                          />
                        ) : media.type === 'video' ? (
                          <video
                            src={media.url}
                            className="w-full h-auto max-h-96 object-cover"
                            controls
                            preload="metadata"
                          />
                        ) : null}
                        
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
                      className={`flex items-center space-x-2 transition-colors ${
                        (post.likedBy && post.likedBy.includes(currentUser.id))
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${
                        (post.likedBy && post.likedBy.includes(currentUser.id)) ? 'fill-current' : ''
                      }`} />
                      <span className="text-sm">{post.likes || 0}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments || 0}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                      <Share className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onBookmarkPost(post.id)}
                    className={`transition-colors ${
                      bookmarkedPosts && bookmarkedPosts.includes(post.id)
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-500 hover:text-yellow-500'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${
                      bookmarkedPosts && bookmarkedPosts.includes(post.id) ? 'fill-current' : ''
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;