import React, { useState } from "react";
import { sendMessageToBot } from "../services/api";
import ResponsePlayer from "./ResponsePlayer";
import VoiceRecorder from "./VoiceRecorder";
import PersonaSelector from "./PersonaSelector";
import "../App.css";

const Dashboard = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("friendly");
  const [isLoading, setIsLoading] = useState(false);

  // 🧠 Core message handler (connects to backend)
  const handleUserMessage = async (message) => {
    if (!message.trim()) return;
    setIsLoading(true);

    try {
      const response = await sendMessageToBot(message, "demo_user", selectedPersona);

      setChatHistory((prev) => [
        ...prev,
        { sender: "user", text: message },
        {
          sender: "bot",
          text: response.reply,
          emotion: response.emotion?.label,
          language: response.language,
          persona: response.persona,
          mood: response.mood,
        },
      ]);

      // 🎙️ Automatically play the bot’s reply
      if (response.reply) {
        ResponsePlayer(response.reply, response.language);
      }
    } catch (error) {
      console.error("❌ Chat Error:", error);
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  // 🗣️ Triggered when user sends a text message
  const handleSendClick = () => handleUserMessage(userInput);

  // 🎤 Triggered when speech-to-text returns transcribed message
  const handleVoiceInput = (transcribedText) => handleUserMessage(transcribedText);

  return (
    <div className="dashboard">
      <h1 className="title">PolyLingo – Multilingual Voice Chatbot 🌍</h1>

      {/* 🎭 Persona Selector */}
      <PersonaSelector
        selectedPersona={selectedPersona}
        onChange={(persona) => setSelectedPersona(persona)}
      />

      {/* 💬 Chat Container */}
      <div className="chat-container">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
          >
            <div className="bubble">
              <p>{msg.text}</p>
              {msg.sender === "bot" && (
                <small className="meta">
                  {msg.language?.toUpperCase()} · {msg.emotion?.toUpperCase()} ·{" "}
                  {msg.persona?.toUpperCase()}
                </small>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="loading">Thinking...</div>}
      </div>

      {/* ✍️ Text Input */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendClick()}
          className="input-box"
        />
        <button onClick={handleSendClick} className="send-btn">
          Send
        </button>
      </div>

      {/* 🎙️ Voice Recorder */}
      <VoiceRecorder onTranscription={handleVoiceInput} />
    </div>
  );
};

export default Dashboard;
