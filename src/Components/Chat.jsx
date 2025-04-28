import axios from 'axios';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function Chat() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);  // Only private messages here
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users/allUser');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('private message', ({ from, message }) => {
      setMessages((prev) => [...prev, { from, message }]);
    });

    return () => {
      socket.off('connect');
      socket.off('private message');
    };
  }, []);

  const handleJoin = () => {
    if (username.trim() && !hasJoined) {
      socket.emit('join', username);
       
      setHasJoined(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && username && selectedUser) {
      socket.emit('private message', { to: selectedUser, message });
      setMessages((prev) => [...prev, { from: username, message }]);
      setMessage('');
    }
  };

  const handleSelectUser = (user) => {
    if (user.name === username) {
      alert("You can't DM yourself!");
      return;
    }
    setSelectedUser(user.name);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!hasJoined ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Join Private Chat</h1>
          {loading && <p className="text-center text-gray-500">Loading users...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoin}
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-screen">
          {/* Sidebar */}
          <div className="w-1/4 bg-white shadow-md p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">All Users</h2>
            <ul className="space-y-2">
              {users
                .filter((u) => u.username !== username) // Don't show yourself
                .map((user, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectUser(user)}
                    className={`cursor-pointer p-2 rounded ${selectedUser === user.name ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                  >
                    {user.name}
                  </li>
                ))}
            </ul>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col p-4">
            {/* Chat Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedUser ? `Chatting with @${selectedUser}` : 'Select a user to start chatting'}
              </h2>
              <span className="text-sm text-gray-500">{isConnected ? '🟢 Connected' : '🔴 Disconnected'}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded border mb-4">
              {selectedUser ? (
                messages
                  .filter(
                    (msg) =>
                      (msg.from === username && selectedUser) ||
                      (msg.from === selectedUser)
                  )
                  .map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 ${msg.from === username ? 'text-right' : 'text-left'}`}
                    >
                      <span
                        className={`inline-block p-2 rounded ${msg.from === username
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <strong>{msg.from}:</strong> {msg.message}
                      </span>
                    </div>
                  ))
              ) : (
                <p className="text-center text-gray-400 mt-10">Please select a user to chat.</p>
              )}
            </div>

            {/* Message input */}
            {selectedUser && (
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message @${selectedUser}...`}
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
