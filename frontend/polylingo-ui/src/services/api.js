import axios from "axios";

// 🌐 Backend API base URL
const API_BASE = "http://127.0.0.1:8000/api/nlp";

/* ============================================================================
   🧠 1. Send message to backend
   ========================================================================== */
export async function sendMessageToBot(user_input, user_id = "guest", persona = "friendly") {
  try {
    const response = await axios.post(`${API_BASE}/response`, {
      user_input,
      user_id,
      persona,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error sending message:", error);
    throw error;
  }
}

/* ============================================================================
   🔊 2. Convert text to speech (TTS)
   Uses browser’s SpeechSynthesis API for multilingual support.
   ========================================================================== */
export function synthesizeSpeech(text, language = "en") {
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language || "en-US";
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // 🎵 Pick a voice matching the language if available
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find((v) => v.lang.startsWith(language)) || voices[0];
  utterance.voice = selectedVoice;

  window.speechSynthesis.speak(utterance);
}

/* ============================================================================
   🎤 3. Transcribe audio (Speech-to-Text)
   Uses browser’s built-in Web Speech API for instant transcription.
   ========================================================================== */
export async function transcribeAudio() {
  return new Promise((resolve, reject) => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject("SpeechRecognition not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US"; // You can dynamically set based on user persona/language
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        console.error("🎙️ Voice recognition error:", event.error);
        reject(event.error);
      };

      recognition.start();
    } catch (error) {
      reject(error);
    }
  });
}

/* ============================================================================
   🎭 0. Get available personas for the selector
   ========================================================================== */
export async function getPersonas() {
  // For now, we'll use local static data.
  // Later, you can connect this to a backend endpoint (/api/personas/personas)
  // if your teammates implement it.
  return [
    { id: "friendly", label: "Friendly 🤗" },
    { id: "witty", label: "Witty 😏" },
    { id: "caring", label: "Caring 💖" },
    { id: "professional", label: "Professional 💼" },
    { id: "neutral", label: "Neutral 🧘‍♂️" },
  ];
}
export const processNlp = sendMessageToBot;