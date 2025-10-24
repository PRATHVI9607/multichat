// src/components/Dashboard.jsx
import React from 'react';

const Dashboard = ({ messages, messagesEndRef }) => {
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.type}`}>
          {msg.type === 'bot' && (
            <div className="message-avatar">
              {msg.persona ? msg.persona[0].toUpperCase() : 'P'} {/* Display first letter of persona */}
            </div>
          )}
          <div className="message-content">
            {msg.text}
            <span className="message-meta">
              {msg.type === 'user' ? 'You' : (msg.persona || 'PolyLingo')}
            </span>
          </div>
          {msg.type === 'user' && <div className="message-avatar">U</div>} {/* User Avatar */}
        </div>
      ))}
      <div ref={messagesEndRef} /> {/* Invisible element to scroll into view */}
    </div>
  );
};

export default Dashboard;