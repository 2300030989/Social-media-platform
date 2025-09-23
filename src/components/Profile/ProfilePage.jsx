import React, { useState } from 'react';
import { Calendar, MapPin, Link, Edit, Camera, UserPlus, UserMinus } from 'lucide-react';
import ProfileEditModal from './ProfileEditModal';

const ProfilePage = ({ 
  currentUser, 
  users, 
  posts, 
  onUpdateProfile, 
  setCurrentPage 
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const userPosts = posts.filter(post => post.userId === currentUser.id);
  const isFollowing = (userId) => (currentUser.following || []).includes(userId);

  const tabs = [
    { id: 'posts', label: 'Posts', count: userPosts.length },
    { id: 'media', label: 'Media', count: 0 },
    { id: 'likes', label: 'Likes', count: 0 }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600 relative">
          <button className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-16 mb-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {currentUser.displayName}
            </h1>
            <p className="text-gray-500 mb-3">@{currentUser.username}</p>
            
            {currentUser.bio && (
              <p className="text-gray-700 mb-3">{currentUser.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              {currentUser.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{currentUser.location}</span>
                </div>
              )}
              
              {currentUser.website && (
                <div className="flex items-center space-x-1">
                  <Link className="w-4 h-4" />
                  <a
                    href={currentUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {currentUser.website}
                  </a>
                </div>
              )}
              
              {currentUser.joinDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {currentUser.joinDate}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div>
                <span className="font-semibold text-gray-900">
                  {(currentUser.following || []).length}
                </span>
                <span className="text-gray-500 ml-1">Following</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  {currentUser.followers || 0}
                </span>
                <span className="text-gray-500 ml-1">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No posts yet</p>
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Create your first post
                  </button>
                </div>
              ) : (
                userPosts.map((post) => (
                  <div key={post.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex space-x-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {currentUser.displayName}
                          </h3>
                          <span className="text-gray-500 text-sm">
                            @{currentUser.username} • {post.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{post.content}</p>
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.hashtags.map((hashtag, index) => (
                              <span
                                key={index}
                                className="text-purple-600 text-sm"
                              >
                                #{hashtag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Post Media */}
                        {post.mediaUrls && post.mediaUrls.length > 0 && (
                          <div className="mb-3">
                            <div className="grid grid-cols-1 gap-2">
                              {post.mediaUrls.map((mediaUrl, index) => (
                                <div key={index} className="rounded-lg overflow-hidden">
                                  {mediaUrl.startsWith('data:image') ? (
                                    <img
                                      src={mediaUrl}
                                      alt="Post media"
                                      className="w-full h-auto max-h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                      onClick={() => {
                                        const newWindow = window.open();
                                        newWindow.document.write(`<img src="${mediaUrl}" style="max-width:100%;height:auto;" />`);
                                      }}
                                    />
                                  ) : mediaUrl.startsWith('data:video') ? (
                                    <video
                                      src={mediaUrl}
                                      className="w-full h-auto max-h-48 object-cover"
                                      controls
                                      preload="metadata"
                                    />
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{post.likes || 0} likes</span>
                          <span>{post.comments || 0} comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="text-center py-12">
              <p className="text-gray-500">No media posts yet</p>
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="text-center py-12">
              <p className="text-gray-500">No liked posts yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <ProfileEditModal
          currentUser={currentUser}
          onUpdateProfile={onUpdateProfile}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;