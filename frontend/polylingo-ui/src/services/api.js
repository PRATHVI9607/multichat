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
   Returns the utterance object so callers can observe events.
   ========================================================================== */
export function synthesizeSpeech(text, language = "en") {
  if (!text) return null;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language || "en-US";
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // pick a voice matching the language if available
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find((v) => v.lang && v.lang.startsWith(language)) || voices[0];
  if (selectedVoice) utterance.voice = selectedVoice;

  // speak (non-blocking)
  window.speechSynthesis.speak(utterance);

  // return utterance so caller can hook onend/onstart if needed
  return utterance;
}

/* Optional helper if you want a Promise-based wrapper */
export function synthesizeSpeechAsync(text, language = "en") {
  return new Promise((resolve, reject) => {
    try {
      const utt = synthesizeSpeech(text, language);
      if (!utt) return resolve();
      utt.onend = () => resolve();
      utt.onerror = (e) => reject(e);
    } catch (err) {
      reject(err);
    }
  });
}

/* ============================================================================
   🎤 3. Transcribe audio (Speech-to-Text)
   Uses browser’s built-in Web Speech API for instant transcription.
   Returns a promise that resolves with the transcript string.
   ========================================================================== */
export async function transcribeAudio() {
  return new Promise((resolve, reject) => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject(new Error("SpeechRecognition not supported in this browser."));
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US"; // can be dynamic
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
  return [
    { id: "friendly", label: "Friendly 🤗" },
    { id: "witty", label: "Witty 😏" },
    { id: "caring", label: "Caring 💖" },
    { id: "professional", label: "Professional 💼" },
    { id: "neutral", label: "Neutral 🧘‍♂️" },
  ];
}

/* Backwards compatible alias */
export const processNlp = sendMessageToBot;
