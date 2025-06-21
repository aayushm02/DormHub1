import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = () => {
  const [chatPartner, setChatPartner] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = io('http://localhost:5000', { transports: ['websocket'] });

  useEffect(() => {
    socket.on('connect', () => console.log('Socket connected:', socket.id));
    socket.on('receiveMessage', ({ sender, content }) => {
      setMessages(prev => [...prev, { sender, content }]);
    });
    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (!chatPartner || !newMessage) {
      alert('Please enter a recipient ID and message');
      return;
    }
    socket.emit('sendMessage', { recipient: chatPartner, content: newMessage });
    setMessages([...messages, { sender: 'You', content: newMessage }]);
    setNewMessage('');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Chat</h2>
      <p className="text-sm mb-2">Note: Use socket ID from console as recipient ID</p>
      <input
        type="text"
        placeholder="Chat with (user ID)"
        value={chatPartner}
        onChange={e => setChatPartner(e.target.value)}
        className="border p-2 mr-2 rounded w-full mb-2"
      />
      <div className="border p-4 h-64 overflow-y-scroll mb-2 rounded bg-white shadow-md">
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.sender}:</strong> {msg.content}</p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        className="border p-2 mr-2 rounded w-full mb-2"
      />
      <button
        onClick={sendMessage}
        className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
