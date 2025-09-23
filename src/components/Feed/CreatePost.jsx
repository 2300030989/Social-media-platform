import React, { useState } from 'react';
import { Smile, MapPin, X, FileImage } from 'lucide-react';

const CreatePost = ({ currentUser, onCreatePost }) => {
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const newMedia = await Promise.all(
        files.map(async (file, index) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                id: Date.now() + index,
                type: file.type.startsWith('image/') ? 'image' : 'video',
                url: e.target.result,
                file: file,
                name: file.name,
                size: file.size
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );
      
      setSelectedMedia(prev => [...prev, ...newMedia]);
    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = (mediaId) => {
    setSelectedMedia(prev => prev.filter(media => media.id !== mediaId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    const hashtagArray = hashtags
      .split(' ')
      .filter(tag => tag.startsWith('#'))
      .map(tag => tag.slice(1))
      .filter(tag => tag.length > 0);

    const newPost = {
      content: content.trim(),
      hashtags: hashtagArray,
      media: selectedMedia,
      mediaUrls: selectedMedia.map(media => media.url)
    };

    onCreatePost(newPost);
    setContent('');
    setHashtags('');
    setSelectedMedia([]);
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.displayName}
            className="w-10 h-10 rounded-full"
          />
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's happening?"
              className="w-full resize-none border-none outline-none text-lg placeholder-gray-500"
              rows={isExpanded ? 3 : 1}
            />
            
            {isExpanded && (
              <div className="mt-3">
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="Add hashtags (e.g., #design #tech)"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
            
            {/* Media Preview */}
            {selectedMedia.length > 0 && (
              <div className="mt-3">
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {selectedMedia.map((media) => (
                    <div key={media.id} className="relative group">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt="Upload preview"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          controls
                        />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg"></div>
                      <button
                        type="button"
                        onClick={() => removeMedia(media.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {media.name}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedMedia.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedMedia.length} file{selectedMedia.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors cursor-pointer">
                <FileImage className="w-5 h-5" />
                <span className="text-sm">Media</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              
              <button
                type="button"
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Smile className="w-5 h-5" />
                <span className="text-sm">Emoji</span>
              </button>
              
              <button
                type="button"
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Location</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setContent('');
                  setHashtags('');
                  setSelectedMedia([]);
                  setIsExpanded(false);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <button
                type="submit"
                disabled={!content.trim() || isUploading}
                className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Post</span>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;