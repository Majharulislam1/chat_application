import React, { useState, useEffect, useRef } from 'react';

function ChatWindow({ messages, username, selectedUser, onSendMessage }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-500">Select a conversation to start chatting</p>
        <p className="text-gray-400 text-sm mt-2">Activate Windows<br />Go to Settings to activate Windows.</p>
      </div>
    );
  }

  let lastDate = null;

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      <div className="bg-white p-4 border-b border-gray-200 flex items-center">
        <img
          src={`https://via.placeholder.com/40?text=${selectedUser[0]}`}
          alt={selectedUser}
          className="w-10 h-10 rounded-full mr-3"
        />
        <h2 className="text-lg font-semibold">{selectedUser}</h2>
        <div className="ml-auto flex space-x-2">
          <button className="text-gray-500 hover:text-gray-700">📞</button>
          <button className="text-gray-500 hover:text-gray-700">🎥</button>
          <button className="text-gray-500 hover:text-gray-700">⋯</button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => {
          const msgDate = formatTimestamp(msg.timestamp);
          const showDate = lastDate !== msgDate;
          lastDate = msgDate;

          return (
            <React.Fragment key={index}>
              {showDate && (
                <div className="text-center my-4">
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{msgDate}</span>
                </div>
              )}
              <div
                className={`flex ${
                  msg.user === username ? 'justify-end' : 'justify-start'
                } mb-2`}
              >
                {msg.user !== username && (
                  <img
                    src={`https://via.placeholder.com/30?text=${msg.user[0]}`}
                    alt={msg.user}
                    className="w-8 h-8 rounded-full mr-2 self-end"
                  />
                )}
                <div>
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      msg.user === username
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`text-xs text-gray-500 mt-1 ${
                      msg.user === username ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatMessageTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white p-4 border-t border-gray-200">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <button type="button" className="text-gray-500 hover:text-gray-700">
            📎
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-700">
            ➕
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message here"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="text-green-500 hover:text-green-700"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;