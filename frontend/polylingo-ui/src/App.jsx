// src/App.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import logo from './assets/react.svg';
import './App.css'; // Global application styles

// Import your custom components
import Dashboard from './components/Dashboard';
import PersonaSelector from './components/PersonaSelector';
import VoiceRecorder from './components/VoiceRecorder';
import useResponsePlayer from './components/ResponsePlayer'; // Import the custom hook

// --- MOCK API FUNCTIONS ---
// In a production app, these would be actual API calls to your backend/AI services
// For hackathon demonstration, these simulate AI responses and latency.
const mockApi = {
  // Simulates Speech-to-Text (STT)
  recognizeSpeech: async (language) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const phrases = {
          en: ["Hello PolyLingo, how are you?", "Tell me a joke.", "What is the weather like?", "Switch to Hindi please.", "I want a witty response.", "Change to a caring persona."],
          hi: ["नमस्ते पॉलीलिंगो, आप कैसे हैं?", "एक चुटकुला सुनाओ।", "मौसम कैसा है?", "कृपया अंग्रेजी पर स्विच करें।", "मुझे एक मजाकिया जवाब चाहिए।", "देखभाल करने वाले व्यक्तित्व में बदलें।"],
          es: ["Hola PolyLingo, ¿cómo estás?", "¿Cuéntame un chiste?", "¿Qué tiempo hace?", "Por favor, cambia a inglés.", "Quiero una respuesta ingeniosa.", "Cambia a una persona cariñosa."],
        };
        // Get a random phrase or a default if language not found
        const randomPhrase = phrases[language]?.[Math.floor(Math.random() * phrases[language].length)] || "I didn't catch that.";
        resolve(randomPhrase);
      }, 1500); // Simulate network latency
    });
  },

  // Simulates Natural Language Processing (NLP) for response generation
  generateResponse: async (query, language, persona, enthusiasm) => {
    return new Promise(resolve => {
      setTimeout(() => {
        let botResponse = "I'm not sure how to respond to that.";
        let responseLanguage = language; // Default to current language for response
        let newPersona = persona; // Default to current persona for response

        const lowerQuery = query.toLowerCase();

        // Basic intent and language switching detection
        if (lowerQuery.includes("hello") || lowerQuery.includes("hola") || lowerQuery.includes("नमस्ते")) {
          if (persona === "witty") botResponse = `Well hello there, human! Ready for some linguistic acrobatics?`;
          if (persona === "caring") botResponse = `Hello! It's so good to hear from you. How can I brighten your day?`;
          if (persona === "geeky") botResponse = `Greetings, user. My systems are online. How may I assist your query stream?`;
        } else if (lowerQuery.includes("joke") || lowerQuery.includes("चुटकुला") || lowerQuery.includes("chiste")) {
          if (language === 'en') botResponse = `Why don't scientists trust atoms? Because they make up everything!`;
          if (language === 'hi') botResponse = `वैज्ञानिक परमाणुओं पर भरोसा क्यों नहीं करते? क्योंकि वे सब कुछ बनाते हैं!`;
          if (language === 'es') botResponse = `¿Por qué los científicos no confían en los átomos? ¡Porque lo compensan todo!`;
        } else if (lowerQuery.includes("weather") || lowerQuery.includes("मौसम") || lowerQuery.includes("tiempo")) {
          if (language === 'en') botResponse = `The forecast says... a 90% chance of me assisting you today!`;
          if (language === 'hi') botResponse = `पूर्वानुमान कहता है... आज मेरे द्वारा आपकी सहायता करने की 90% संभावना है!`;
          if (language === 'es') botResponse = `El pronóstico dice... ¡un 90% de posibilidades de que te ayude hoy!`;
        } else if ((lowerQuery.includes("hindi") || lowerQuery.includes("हिन्दी")) && language !== 'hi') {
            botResponse = "ठीक है, मैं अब हिंदी में बात कर रहा हूँ। आपको कैसे मदद कर सकता हूँ?";
            responseLanguage = 'hi'; // Simulate language switch
        } else if (lowerQuery.includes("english") && language !== 'en') {
            botResponse = "Alright, I'm speaking English now. How can I assist you?";
            responseLanguage = 'en'; // Simulate language switch
        } else if ((lowerQuery.includes("spanish") || lowerQuery.includes("español")) && language !== 'es') {
            botResponse = "De acuerdo, ahora hablo español. ¿Cómo puedo ayudarte?";
            responseLanguage = 'es'; // Simulate language switch
        } else if (lowerQuery.includes("witty persona") || lowerQuery.includes("ingenioso") || lowerQuery.includes("मजाकिया")) {
            botResponse = (language === 'en' ? "Switching to my quick-witted mode!" : language === 'hi' ? "मैं अब मजाकिया मूड में हूँ!" : "¡Cambiando a mi modo ingenioso!");
            newPersona = 'witty';
        } else if (lowerQuery.includes("caring persona") || lowerQuery.includes("cariñoso") || lowerQuery.includes("देखभाल")) {
            botResponse = (language === 'en' ? "Embracing my more empathetic side." : language === 'hi' ? "मैं अब अधिक देखभाल करने वाला हूँ।" : "Adoptando mi lado más empático.");
            newPersona = 'caring';
        } else if (lowerQuery.includes("geeky persona") || lowerQuery.includes("friki") || lowerQuery.includes("तकनीकी")) {
            botResponse = (language === 'en' ? "Activating optimal data processing protocols for geeky engagement." : language === 'hi' ? "तकनीकी जुड़ाव के लिए इष्टतम डेटा प्रोसेसिंग प्रोटोकॉल सक्रिय कर रहा हूँ।" : "Activando protocolos de procesamiento de datos óptimos para un compromiso geek.");
            newPersona = 'geeky';
        }

        resolve({ response: botResponse, detectedLanguage: responseLanguage, newPersona: newPersona });
      }, 2000); // Simulate processing time
    });
  },

  // Simulates personality adaptation via ML (for gamification twist)
  adaptPersonality: async (userInteractionData, currentMood) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const personas = ["witty", "caring", "geeky"];
        // A simple "ML" logic: randomly pick a new persona or stick to current
        const newPersona = personas[Math.floor(Math.random() * personas.length)];
        console.log(`[ML Mock] Adapting persona to: ${newPersona} based on interaction.`);
        resolve(newPersona);
      }, 500);
    });
  }
};


// Main App Component
function App() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I am PolyLingo, your multilingual persona voice buddy. How can I help you today?', language: 'en', persona: 'witty' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Global language setting
  const [selectedPersona, setSelectedPersona] = useState('witty'); // Global persona setting
  const [enthusiasmLevel, setEnthusiasmLevel] = useState(50); // Global enthusiasm setting

  const messagesEndRef = useRef(null); // Ref to scroll to the latest message

  // Initialize the response player hook
  const playBotResponse = useResponsePlayer(mockApi.synthesizeSpeech, selectedLanguage, enthusiasmLevel);

  // Effect to scroll to the bottom of the chat when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handler for sending a text message (triggered by form submit)
  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    const text = currentInput.trim();
    if (!text) return;

    // 1. Add user message to chat
    setMessages(prev => [...prev, { type: 'user', text, language: selectedLanguage }]);
    setCurrentInput(''); // Clear input field

    // 2. Simulate bot response generation
    const { response, detectedLanguage, newPersona } = await mockApi.generateResponse(text, selectedLanguage, selectedPersona, enthusiasmLevel);

    // 3. Update global state if language or persona changed by bot
    if (detectedLanguage && detectedLanguage !== selectedLanguage) {
      setSelectedLanguage(detectedLanguage);
    }
    if (newPersona && newPersona !== selectedPersona) {
        setSelectedPersona(newPersona);
    }

    // 4. Add bot message to chat
    setMessages(prev => [...prev, {
      type: 'bot',
      text: response,
      language: detectedLanguage || selectedLanguage, // Use detected or current language
      persona: newPersona || selectedPersona // Use new or current persona
    }]);

    // 5. Play bot's response using TTS
    await playBotResponse(response, detectedLanguage || selectedLanguage, enthusiasmLevel);

    // 6. Simulate personality adaptation (gamification twist)
    // This is where a lightweight ML model would suggest a new persona based on interaction history
    const adaptedPersona = await mockApi.adaptPersonality({ query: text, language: selectedLanguage, currentPersona: selectedPersona }, enthusiasmLevel);
    // You could set a timeout or specific conditions before changing the persona
    // For now, it changes immediately after bot response.
    setSelectedPersona(adaptedPersona);

  }, [currentInput, selectedLanguage, selectedPersona, enthusiasmLevel, playBotResponse]); // Dependencies for useCallback


  // Callback from VoiceRecorder when speech is recognized
  const handleSpeechRecognized = useCallback((text) => {
    if (text) {
      setCurrentInput(text); // Populate input with recognized text
      // Optionally, automatically send the message after voice input
      // This allows hands-free operation. Uncomment the line below if desired.
      // handleSendMessage({ preventDefault: () => {} }); // Trigger send manually
    }
  }, [handleSendMessage]); // Dependency for useCallback

  // Callback for VoiceRecorder's listening state changes
  const handleListeningStateChange = useCallback((listening) => {
    setIsListening(listening);
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} className="App-logo" alt="React logo" />
          <h1 className="App-title">PolyLingo</h1>
        </div>
        {/* Potentially add a settings toggle button here for mobile to show/hide PersonaSelector */}
      </header>

      <main className="App-main-content">
        {/* Dashboard component will display chat messages */}
        <Dashboard messages={messages} messagesEndRef={messagesEndRef} />
      </main>

      <footer className="App-footer">
        <form onSubmit={handleSendMessage} className="input-container">
          <input
            type="text"
            className="text-input"
            placeholder="Type your message or use voice..."
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
          />
          {/* VoiceRecorder component for microphone input */}
          <VoiceRecorder
            isListening={isListening}
            onToggleListening={handleListeningStateChange}
            onSpeechRecognized={handleSpeechRecognized}
            selectedLanguage={selectedLanguage}
            mockApiRecognizeSpeech={mockApi.recognizeSpeech}
          />
          <button type="submit" className="voice-button" style={{ backgroundColor: 'var(--accent-color)' }} aria-label="Send message">
            ➤ {/* Send icon */}
          </button>
        </form>

        {/* PersonaSelector component for language, persona, and enthusiasm settings */}
        <PersonaSelector
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedPersona={selectedPersona}
          setSelectedPersona={setSelectedPersona}
          enthusiasmLevel={enthusiasmLevel}
          setEnthusiasmLevel={setEnthusiasmLevel}
        />
      </footer>
    </div>
  );
}

export default App;