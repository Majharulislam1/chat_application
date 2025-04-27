import React from 'react';

function Sidebar({ conversations, onSelectUser, selectedUser }) {
  console.log('Sidebar received conversations:', conversations);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No conversations yet. Start chatting!</p>
          </div>
        ) : (
          conversations.map((convo) => (
            <div
              key={convo.user}
              onClick={() => onSelectUser(convo.user)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
                selectedUser === convo.user ? 'bg-gray-100' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={`https://via.placeholder.com/40?text=${convo.user[0]}`}
                  alt={convo.user}
                  className="w-10 h-10 rounded-full"
                />
                {convo.user === 'Eva Johnston' && (
                  <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-xs text-white">
                    ...
                  </span>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h3 className="text-sm font-semibold">{convo.user}</h3>
                  <span className="text-xs text-gray-500">{formatTimestamp(convo.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{convo.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;