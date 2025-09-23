import React, { useState } from 'react';
import { Search, Send, Phone, Video, MoreHorizontal, Smile } from 'lucide-react';
import { messagesAPI } from '../../services/api';

const MessagesPage = ({ currentUser, users, messages, onSendMessage, conversations }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationMessages, setConversationMessages] = useState([]);

  // Get conversations with real message data
  const conversationList = users
    .filter(user => user.id !== currentUser.id)
    .map(user => ({
      user,
      messages: conversations[user.id] || [],
      lastMessage: conversations[user.id] ? conversations[user.id][conversations[user.id].length - 1] : null,
      unread: conversations[user.id] ? conversations[user.id].some(msg => !msg.read && msg.senderId !== currentUser.id) : false
    }))
    .filter(conv => conv.messages.length > 0 || conv.user.id === selectedUser?.id);

  const filteredConversations = conversationList.filter(conv =>
    conv.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;
    
    setIsLoading(true);
    
    // Add message immediately to UI
    const newMessage = {
      id: Date.now(),
      senderEmail: currentUser.email,
      recipientEmail: selectedUser.email,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setConversationMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    try {
      const sentMessage = await messagesAPI.sendMessage({
        recipientEmail: selectedUser.email,
        content: message.trim()
      });
      
      // Update the temporary message with the real one
      setConversationMessages(prev => 
        prev.map(msg => msg.id === newMessage.id ? sentMessage : msg)
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      // Keep the local message even if backend fails
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversation = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const messages = await messagesAPI.getConversation(user.email);
      setConversationMessages(messages);
    } catch (error) {
      console.error('Failed to load conversation:', error);
      setConversationMessages([]);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    loadConversation(user.id);
  };

  const getCurrentConversation = () => {
    return conversationMessages;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.user.id}
                onClick={() => handleUserSelect(conversation.user)}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left ${
                  selectedUser?.id === conversation.user.id ? 'bg-purple-50 border-r-2 border-purple-500' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={conversation.user.avatar}
                    alt={conversation.user.displayName}
                    className="w-12 h-12 rounded-full"
                  />
                  {conversation.unread && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium truncate ${
                      conversation.unread ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {conversation.user.displayName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessage ? formatTime(conversation.lastMessage.timestamp) : ''}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${
                    conversation.unread ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                    {conversation.lastMessage ? conversation.lastMessage.content : 'Start a conversation'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedUser.displayName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      @{selectedUser.username}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {getCurrentConversation().length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    getCurrentConversation().map((msg) => (
                      <div key={msg.id} className={`flex ${msg.senderEmail === currentUser.email ? 'justify-end' : ''}`}>
                        {msg.senderEmail !== currentUser.email && (
                          <img
                            src={selectedUser.avatar}
                            alt={selectedUser.displayName}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        )}
                        {msg.senderEmail === currentUser.email && (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.displayName}
                            className="w-8 h-8 rounded-full ml-2 order-2"
                          />
                        )}
                        <div className={`px-4 py-2 rounded-2xl max-w-xs ${
                          msg.senderEmail === currentUser.email
                            ? 'bg-purple-600 text-white rounded-br-md order-1'
                            : 'bg-gray-100 rounded-bl-md'
                        }`}>
                          <p>{msg.content}</p>
                          
                          {/* Message Media */}
                          {msg.mediaData && (
                            <div className="mt-2">
                              {msg.mediaType && msg.mediaType.startsWith('image') ? (
                                <img
                                  src={msg.mediaData.startsWith('data:') ? msg.mediaData : `data:${msg.mediaType};base64,${msg.mediaData}`}
                                  alt="Message attachment"
                                  className="max-w-xs rounded"
                                />
                              ) : msg.mediaType && msg.mediaType.startsWith('video') ? (
                                <video
                                  src={msg.mediaData.startsWith('data:') ? msg.mediaData : `data:${msg.mediaType};base64,${msg.mediaData}`}
                                  className="max-w-xs rounded"
                                  controls
                                />
                              ) : null}
                            </div>
                          )}
                          
                          <span className={`text-xs ${
                            msg.senderEmail === currentUser.email ? 'opacity-75' : 'text-gray-500'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  
                  <button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;