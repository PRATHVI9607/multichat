import React, { useState } from 'react';
import { synthesizeSpeech } from '../services/api';

const ResponsePlayer = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = () => {
    if (text && !isLoading) {
      setIsLoading(true);
      synthesizeSpeech(text)
        .then(response => {
          const audio = new Audio(URL.createObjectURL(response.data));
          audio.onplaying = () => setIsPlaying(true);
          audio.onended = () => setIsPlaying(false);
          audio.play();
        })
        .catch(error => {
          console.error('Error synthesizing speech:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div>
      <button onClick={handlePlay} disabled={!text || isLoading || isPlaying}>
        {isLoading ? 'Loading...' : (isPlaying ? 'Playing...' : 'Play Response')}
      </button>
    </div>
  );
};

export default ResponsePlayer;