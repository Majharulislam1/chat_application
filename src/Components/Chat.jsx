import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import queryString from 'query-string';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

const ENDPOINT = 'http://localhost:3000';

const Chat = () => {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    if (!name || !room) {
      setError('Username and room are required');
      return;
    }

    const newSocket = io(ENDPOINT, { withCredentials: true });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join', { name, room }, (error) => {
        if (error) {
          setError(error);
        } else {
          setUsername(name);
          setRoom(room);
          setConversations([{ name: room, lastMessage: '', timestamp: '' }]);
          setSelectedConversation(room);
        }
      });
    });

    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.name === room
            ? { ...conv, lastMessage: message.text, timestamp: message.timestamp }
            : conv
        )
      );
    });

    newSocket.on('roomData', ({ users }) => {
      setUsers(users);
    });

    newSocket.on('connect_error', () => {
      setError('Failed to connect to the server. Please try again.');
    });

    return () => {
      newSocket.disconnect();
      newSocket.off();
    };
  }, [location.search]);

  const sendMessage = (message) => {
    if (message.trim() && socket) {
      socket.emit('sendMessage', message, () => {});
    }
  };

  const handleConversationSelect = (conversationName) => {
    setSelectedConversation(conversationName);
    setMessages([]);
    setRoom(conversationName);
    setIsSidebarOpen(false);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-red-500">Error</h2>
          <p className="text-center text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-screen">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-green-500 text-white rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 sm:w-80 bg-white border-r border-gray-200 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 transition-transform duration-300 ease-in-out sm:static sm:flex sm:flex-col`}
      >
        <Sidebar
          conversations={conversations}
          onSelectConversation={handleConversationSelect}
          selectedConversation={selectedConversation}
        />
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 sm:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && (
          <ChatWindow
            messages={messages}
            users={users}
            username={username}
            room={selectedConversation}
            sendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;