import { useRef, useState } from 'react';

const API = 'http://127.0.0.1:8000/api';

export function useVoiceAgent() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState(
    'Type or tap the mic and say: "I want to store 20 quintals of dry chilli for 3 months"'
  );
  const sessionId = useRef<string | null>(null);
  const recognition = useRef<any>(null);

  const speak = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-IN';
      window.speechSynthesis.speak(u);
    } catch {
      /* speaking is optional */
    }
  };

  const send = async (text: string) => {
    setTranscript(`You: ${text}\n\nThinking...`);
    try {
      const res = await fetch(`${API}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId.current, message: text }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      sessionId.current = data.session_id;
      setTranscript(`You: ${text}\n\nAssistant: ${data.reply}`);
      speak(data.reply);
    } catch (e: any) {
      setTranscript(`Could not reach the assistant (${e.message}). Check the uvicorn terminal for the error.`);
    }
  };

  const sendText = (t: string) => {
    const x = t.trim();
    if (x) send(x);
  };

  const toggleListening = () => {
    if (listening) {
      recognition.current?.stop();
      setListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setTranscript('This browser has no speech input. Please use Chrome, or type below.');
      return;
    }
    const r = new SR();
    r.lang = 'en-IN';
    r.interimResults = false;
    r.onresult = (e: any) => send(e.results[0][0].transcript);
    r.onerror = (e: any) => {
      setListening(false);
      setTranscript(
        `Microphone problem (${e.error}). Click the lock icon next to the web address, set Microphone to Allow, and reload. Or type below.`
      );
    };
    r.onend = () => setListening(false);
    recognition.current = r;
    r.start();
    setListening(true);
    setTranscript('Listening...');
  };

  return { listening, transcript, toggleListening, sendText };
}