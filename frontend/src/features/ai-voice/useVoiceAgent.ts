import { useState } from 'react';

export function useVoiceAgent() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('Listening for voice commands...');

  const toggleListening = () => {
    setListening(!listening);
    if (!listening) {
      setTranscript('Speak now: e.g., "Book cold storage in Guntur for 20 quintals"');
    }
  };

  return { listening, transcript, toggleListening };
}