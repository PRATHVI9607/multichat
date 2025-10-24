import React, { useState, useRef } from 'react';
import { transcribeAudio } from '../services/api';

const VoiceRecorder = ({ onSpeechRecognized }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioFile = new File([audioBlob], "recording.wav");
          transcribeAudio(audioFile)
            .then(response => {
              onSpeechRecognized(response.data.text);
            })
            .catch(error => {
              console.error('Error transcribing audio:', error);
            });
          audioChunksRef.current = [];
        };
        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`voice-button ${isRecording ? 'listening' : ''}`}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      {isRecording ? '🔴' : '🎤'}
    </button>
  );
};

export default VoiceRecorder;