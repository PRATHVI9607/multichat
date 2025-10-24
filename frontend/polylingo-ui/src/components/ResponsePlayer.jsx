// src/components/ResponsePlayer.jsx
import { useCallback } from 'react';

/**
 * Custom hook to encapsulate Text-to-Speech (TTS) functionality.
 * It uses the provided mockApiSynthesizeSpeech function.
 *
 * @param {Function} mockApiSynthesizeSpeech The mock API function for TTS.
 * @returns {Function} A function `playResponse` that can be called to play a text.
 */
const useResponsePlayer = (mockApiSynthesizeSpeech) => {

  const playResponse = useCallback(async (text, language, enthusiasm) => {
    if (text && mockApiSynthesizeSpeech) {
      console.log(`[ResponsePlayer Hook] Preparing to speak: "${text}"`);
      await mockApiSynthesizeSpeech(text, language, enthusiasm);
      console.log(`[ResponsePlayer Hook] Finished speaking.`);
    }
  }, [mockApiSynthesizeSpeech]); // Dependency array for useCallback

  return playResponse;
};

export default useResponsePlayer;