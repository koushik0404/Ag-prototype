import React, { useState } from 'react';
import { useVoiceAgent } from './useVoiceAgent';

interface AiVoiceScreenProps {
  onClose: () => void;
}

const T = { card: '#FFFFFF', ink: '#1B2A22', mute: '#5E6B63', g: '#1F4D3A', g2: '#E3EEE7', y: '#E8A317', line: '#DAD6C8' };

export const AiVoiceScreen: React.FC<AiVoiceScreenProps> = ({ onClose }) => {
  const { listening, transcript, toggleListening, sendText } = useVoiceAgent();
  const [text, setText] = useState('');

  const submit = () => {
    sendText(text);
    setText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
      <div style={{ fontSize: '19px', fontWeight: 800, color: T.ink }}>AI Assistant</div>
      <div style={{ fontSize: '14px', color: T.mute, textAlign: 'center' }}>
        Tell me the crop, how many quintals and how many months.
      </div>

      <button
        onClick={toggleListening}
        aria-label={listening ? 'Stop' : 'Speak'}
        style={{
          width: '76px', height: '76px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: listening ? '#B8402A' : T.g,
          boxShadow: `0 0 0 8px ${listening ? '#B8402A33' : T.g2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z M19 11a7 7 0 0 1-14 0 M12 18v3" />
        </svg>
      </button>
      <div style={{ fontSize: '13px', color: T.mute, fontWeight: 600 }}>{listening ? 'Listening… tap to stop' : 'Tap to speak'}</div>

      <div style={{ width: '100%', boxSizing: 'border-box', backgroundColor: T.card, border: `1px solid ${T.line}`, borderRadius: '14px', padding: '14px', minHeight: '90px', fontSize: '15px', color: T.ink, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
        {transcript}
      </div>

      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Or type here…"
          style={{ flex: 1, minWidth: 0, background: T.card, color: T.ink, border: `1px solid ${T.line}`, borderRadius: '10px', padding: '12px', fontFamily: 'inherit', fontSize: '16px' }}
        />
        <button onClick={submit} style={{ backgroundColor: T.y, color: T.ink, border: 'none', borderRadius: '10px', padding: '0 20px', fontFamily: 'inherit', fontWeight: 800, fontSize: '16px', cursor: 'pointer' }}>
          Send
        </button>
      </div>

      <button onClick={onClose} style={{ width: '100%', background: 'none', color: T.g, border: `1px solid ${T.g}`, borderRadius: '12px', padding: '14px', fontFamily: 'inherit', fontWeight: 800, fontSize: '17px', cursor: 'pointer' }}>
        Back to search
      </button>
    </div>
  );
};