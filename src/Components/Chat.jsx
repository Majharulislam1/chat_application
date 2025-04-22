import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

 
const Chat = () => {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
    const ENDPOINT = 'http://localhost:3000';

    useEffect(() => {
      const { name, room } = queryString.parse(location.search);
      if (!name || !room) {
        setError('Username and room are required');
        return;
      }
  
      const newSocket = io(ENDPOINT, { withCredentials: true });
      setSocket(newSocket);
  
      newSocket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        setError(null);
        newSocket.emit('join', { name, room }, (error) => {
          if (error) {
            setError(error);
          } else {
            setUsername(name);
            setRoom(room);
          }
        });
      });
  
      newSocket.on('message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
  
      newSocket.on('roomData', ({ users }) => {
        setUsers(users);
      });
  
      newSocket.on('connect_error', (err) => {
        console.error('Socket.IO connection error:', err.message);
        setError('Failed to connect to the server. Please try again.');
      });
  
      return () => {
        newSocket.disconnect();
        newSocket.off();
      };
    }, [location.search]);
  
    const sendMessage = (e) => {
      e.preventDefault();
      if (message.trim() && socket) {
        socket.emit('sendMessage', message, () => setMessage(''));
      }
    };
  
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-red-500">Error</h2>
            <p className="text-center">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg flex flex-col h-[80vh]">
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-bold">Chat Room: {room}</h2>
          <p className="text-sm">Logged in as: {username}</p>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                msg.user === username ? 'bg-blue-100 ml-auto' : 'bg-gray-200 mr-auto'
              } max-w-[70%]`}
            >
              <p className="text-sm font-semibold">{msg.user}</p>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <h3 className="text-sm font-semibold mb-2">Users in Room:</h3>
          <ul className="text-sm">
            {users.map((user, index) => (
              <li key={index}>{user.name}</li>
            ))}
          </ul>
        </div>
        <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
    );
};

export default Chat;