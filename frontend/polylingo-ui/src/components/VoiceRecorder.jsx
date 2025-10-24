// src/components/VoiceRecorder.jsx
import React, { useCallback } from 'react';

const VoiceRecorder = ({
  isListening,
  onToggleListening,       // Callback to change listening state in App.jsx
  onSpeechRecognized,      // Callback to send recognized text to App.jsx
  selectedLanguage,
  mockApiRecognizeSpeech,  // The mock STT API function
}) => {
  const handleClick = useCallback(async () => {
    // If we're not currently listening, start the process
    if (!isListening) {
      onToggleListening(true); // Inform parent we are starting to listen

      // Simulate speech recognition
      const recognizedText = await mockApiRecognizeSpeech(selectedLanguage);

      onToggleListening(false); // Inform parent we have stopped listening
      if (recognizedText) {
        onSpeechRecognized(recognizedText); // Send the recognized text to parent
      }
    }
    // If isListening was true, clicking means we *intended* to stop,
    // but the mock automatically stops after recognition, so no extra action needed here.
    // In a real app, you'd have a separate 'stop' logic.
  }, [isListening, onToggleListening, onSpeechRecognized, selectedLanguage, mockApiRecognizeSpeech]);

  return (
    <button
      type="button" // Important: Prevents form submission
      onClick={handleClick}
      className={`voice-button ${isListening ? 'listening' : ''}`}
      aria-label={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? '🔴' : '🎤'} {/* Red dot when listening, microphone when not */}
    </button>
  );
};

export default VoiceRecorder;