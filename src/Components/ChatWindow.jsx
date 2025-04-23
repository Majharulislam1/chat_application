import React, { useState, useEffect, useRef } from 'react';

const ChatWindow = ({ messages, users, username, room, sendMessage }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const getMessageDateLabel = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return 'TODAY';
    } else if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      return 'YESTERDAY';
    } else {
      return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
    }
  };

  const messagesWithSeparators = [];
  let lastDate = null;

  messages.forEach((msg, index) => {
    const messageDate = new Date(msg.timestamp);
    const dateLabel = getMessageDateLabel(msg.timestamp);

    if (lastDate !== dateLabel) {
      messagesWithSeparators.push({ type: 'separator', label: dateLabel });
      lastDate = dateLabel;
    }
    messagesWithSeparators.push({ type: 'message', msg, index });
  });

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-white flex justify-between items-center">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{room}</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {users.length} {users.length === 1 ? 'user' : 'users'} online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-3 sm:p-6 overflow-y-auto bg-gray-100">
        {messagesWithSeparators.map((item, index) =>
          item.type === 'separator' ? (
            <div key={index} className="text-center my-2 sm:my-4">
              <span className="text-xs text-gray-500 bg-gray-200 px-2 sm:px-3 py-1 rounded-full">
                {item.label}
              </span>
            </div>
          ) : (
            <div
              key={item.index}
              className={`mb-2 sm:mb-4 flex ${
                item.msg.user === username ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] sm:max-w-xs p-2 sm:p-3 rounded-lg ${
                  item.msg.user === username
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-sm sm:text-base">{item.msg.text}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(item.msg.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 border-t border-gray-200 flex gap-2 bg-white"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
          placeholder="Type your message here"
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          aria-label="Message input"
        />
        <button
          type="submit"
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Send message"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;