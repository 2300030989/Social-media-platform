import React from 'react';
import CreatePost from './CreatePost';
import { Heart, MessageCircle, Bookmark, Share, Trash2 } from 'lucide-react';

const HomePage = ({ 
  currentUser, 
  users, 
  posts, 
  isLoadingPosts,
  onCreatePost, 
  onLikePost, 
  onBookmarkPost, 
  bookmarkedPosts,
  onFollowUser, 
  onUnfollowUser,
  onDeletePost
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
        {isLoadingPosts ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-500">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No posts yet</p>
            <p className="text-sm text-gray-400">Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => {
          const author = getUserById(post.userId);
          // If no author found by userId, try to find by email
          const authorByEmail = author || users.find(u => u.email === post.authorEmail);
          if (!authorByEmail) return null;

          return (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={authorByEmail.avatar}
                    alt={authorByEmail.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{authorByEmail.displayName}</h3>
                    <p className="text-sm text-gray-500">@{authorByEmail.username} • {post.timestamp}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {authorByEmail.id !== currentUser.id && (
                    <button
                      onClick={() => {
                        if (authorByEmail) {
                          isFollowing(authorByEmail.id) ? onUnfollowUser(authorByEmail.email) : onFollowUser(authorByEmail.email);
                        }
                      }}
                      className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                        isFollowing(authorByEmail.id)
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {isFollowing(authorByEmail.id) ? 'Following' : 'Follow'}
                    </button>
                  )}
                  {authorByEmail.email === currentUser.email && (
                    <button
                      className="p-2 hover:bg-red-50 rounded-full text-red-600 hover:text-red-700 transition-colors"
                      title="Delete post"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                          onDeletePost(post.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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

              {/* Post Media - Backend stored media */}
              {post.mediaData && (
                <div className="px-4 pb-3">
                  <div className="rounded-lg overflow-hidden">
                    {post.mediaType && post.mediaType.startsWith('image') ? (
                      <img
                        src={post.mediaData.startsWith('data:') ? post.mediaData : `data:${post.mediaType};base64,${post.mediaData}`}
                        alt="Post media"
                        className="w-full h-auto max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => {
                          const newWindow = window.open();
                          const mediaSrc = post.mediaData.startsWith('data:') ? post.mediaData : `data:${post.mediaType};base64,${post.mediaData}`;
                          newWindow.document.write(`<img src="${mediaSrc}" style="max-width:100%;height:auto;" />`);
                        }}
                        onError={(e) => {
                          console.error('Image load error:', e);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : post.mediaType && post.mediaType.startsWith('video') ? (
                      <video
                        src={post.mediaData.startsWith('data:') ? post.mediaData : `data:${post.mediaType};base64,${post.mediaData}`}
                        className="w-full h-auto max-h-96 object-cover"
                        controls
                        preload="metadata"
                        onError={(e) => {
                          console.error('Video load error:', e);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              )}

              {/* Post Media - Legacy frontend media */}
              {!post.mediaData && (post.mediaUrls && post.mediaUrls.length > 0) && (
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
                            onError={(e) => {
                              console.error('Image load error:', e);
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : mediaUrl.startsWith('data:video') ? (
                          <video
                            src={mediaUrl}
                            className="w-full h-auto max-h-96 object-cover"
                            controls
                            preload="metadata"
                            onError={(e) => {
                              console.error('Video load error:', e);
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : mediaUrl.startsWith('http') ? (
                          <img
                            src={mediaUrl}
                            alt="Post media"
                            className="w-full h-auto max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => {
                              // Open image in new tab for full view
                              const newWindow = window.open();
                              newWindow.document.write(`<img src="${mediaUrl}" style="max-width:100%;height:auto;" />`);
                            }}
                            onError={(e) => {
                              console.error('Image load error:', e);
                              e.target.style.display = 'none';
                            }}
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
        })
        )}
      </div>
    </div>
  );
};

export default HomePage;