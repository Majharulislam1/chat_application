import React, { useState } from 'react';

const Sidebar = ({ conversations, onSelectConversation, selectedConversation }) => {
  const [search, setSearch] = useState('');
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Search Bar */}
      <div className="p-3 sm:p-4">
        <input
          type="text"
          placeholder="Search conversations"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          aria-label="Search conversations"
        />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <div
              key={conv.name}
              onClick={() => onSelectConversation(conv.name)}
              role="button"
              aria-selected={selectedConversation === conv.name}
              className={`p-3 sm:p-4 flex items-center border-b border-gray-200 cursor-pointer ${
                selectedConversation === conv.name ? 'bg-gray-100' : ''
              } hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full mr-2 sm:mr-3"></div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{conv.name}</h3>
                  <span className="text-xs text-gray-500">
                    {conv.timestamp ? new Date(conv.timestamp).toLocaleTimeString() : ''}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{conv.lastMessage || ''}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="p-3 sm:p-4 text-gray-500 text-sm">No conversations found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;