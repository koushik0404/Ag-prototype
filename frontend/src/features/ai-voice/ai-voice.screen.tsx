import React from 'react';
import { AiGlow } from './AiGlow';
import { useVoiceAgent } from './useVoiceAgent';
import { Button } from '../../components/Button';

interface AiVoiceScreenProps {
  onClose: () => void;
}

export const AiVoiceScreen: React.FC<AiVoiceScreenProps> = ({ onClose }) => {
  const { listening, transcript, toggleListening } = useVoiceAgent();

  return (
    <div className="px-4 flex flex-col items-center justify-center gap-6 py-10">
      <h2 className="text-sm font-bold text-emerald-100">AI Voice Assistant</h2>
      <AiGlow />
      <p className="text-xs text-emerald-300 text-center px-4 italic">{transcript}</p>
      <div className="w-full flex flex-col gap-3 mt-4">
        <Button onClick={toggleListening}>{listening ? 'Stop Listening' : 'Start Voice Command'}</Button>
        <Button variant="outline" onClick={onClose}>Back to Search</Button>
      </div>
    </div>
  );
};