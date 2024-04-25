'use client'
import React, { useState } from 'react';
import { useSocket } from './context/SocketProvider';
// import './Page.css'; // Import CSS file for styling

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="page-container">
      <header className="header">Chat App</header>
      <div className="chat-container">
        <div className="messages">
          <ul>
            {messages.map((msg, index) => (
              <li key={index} className="message">{msg}</li>
            ))}
          </ul>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            className="message-input"
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
      <footer className="footer">© 2024 Chat App made by Tushar Agarwal</footer>
    </div>
  );
}
