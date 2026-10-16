import React, { useState, useEffect, useRef } from 'react';
import './ChatInterface.css';

const WHEAT_LOGO_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5"/></svg>`;

const MIC_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>`;

const SEND_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

// Exact crisp chevron matching your screenshot
const BACK_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;

const translations = {
  en: {
    advisorName: "AI Advisor",
    subtitle: "Ask about storage, prices, crops",
    today: "Today",
    botMsg: "Hello! I am your storage advisor.\nHow can I help you today?",
    userQuery: "I need cold storage for 20 quintals of chilli in Guntur",
    storeQuestion: "Best option near you for chilli:",
    storeName: "Sri Lakshmi Cold Storage",
    storeLocation: "Guntur · 6 km",
    priceUnit: "per quintal",
    bookingPrompt: "Would you like me to book it?",
    bookNow: "Book now",
    comparePrices: "Compare prices",
    otherStores: "Other stores",
    typePlaceholder: "Type your question...",
    listening: "Listening",
    cancel: "Cancel",
    tapToStop: "Tap to stop",
    send: "Send",
    bookingConfirmed: "Great! Your slot has been reserved successfully. Shall I proceed to payment?",
    comparing: "Comparing prices: Sri Lakshmi (₹38/qntl) is lower than regional average (₹42/qntl).",
    otherOptions: "Here are other stores nearby:\n1. Sri Lakshmi Cold Storage - ₹38/qntl\n2. Vijaya Cold Storage - ₹40/qntl\n3. Kisan Storage - ₹39/qntl",
    dashboardBtn: "Dashboard",
    logoutBtn: "Logout",
    langToggle: "తెలుగు"
  },
  te: {
    advisorName: "AI సలహాదారు",
    subtitle: "నిల్వ, ధరలు మరియు పంటల గురించి అడగండి",
    today: "ఈరోజు",
    botMsg: "నమస్కారం! నేను మీ నిల్వ సలహాదారుని.\nఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
    userQuery: "నాకు గుంటూరులో 20 క్వింటాళ్ల మిరపకాయల కోసం కోల్డ్ స్టోరేజ్ కావాలి",
    storeQuestion: "మీకు దగ్గరలో ఉన్న ఉత్తమ మిరప నిల్వ ఎంపిక:",
    storeName: "శ్రీ లక్ష్మి కోల్డ్ స్టోరేజ్",
    storeLocation: "గుంటూరు · 6 కి.మీ",
    priceUnit: "క్వింటాలుకు",
    bookingPrompt: "నేను దీన్ని బుక్ చేయమంటారా?",
    bookNow: "ఇప్పుడే బుక్ చేయండి",
    comparePrices: "ధరలను పోల్చండి",
    otherStores: "ఇది కాక ఇతర స్టోర్లు",
    typePlaceholder: "మీ ప్రశ్నను టైప్ చేయండి...",
    listening: "వింటున్నాను",
    cancel: "రద్దు చేయు",
    tapToStop: "ఆపడానికి నొక్కండి",
    send: "పంపు",
    bookingConfirmed: "గొప్పది! మీ స్లాట్ విజయవంతంగా రిజర్వ్ చేయబడింది. చెల్లింపుకు వెళ్ళమంటారా?",
    comparing: "ధరల పోలిక: శ్రీ లక్ష్మి (₹38/క్వింటాలు) సగటు ధర ₹42 కంటే తక్కువగా ఉంది.",
    otherOptions: "దగ్గరలోని ఇతర స్టోర్లు:\n1. శ్రీ లక్ష్మి కోల్డ్ స్టోరేజ్ - ₹38\n2. విజయ కోల్డ్ స్టోరేజ్ - ₹40\n3. కిసాన్ స్టోరేజ్ - ₹39",
    dashboardBtn: "డాష్‌బోర్డ్",
    logoutBtn: "లాగ్ అవుట్",
    langToggle: "English"
  }
};

function ChatInterface({ onBack }) {
  const [lang, setLang] = useState('en');
  const [inputValue, setInputValue] = useState('');
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [listeningTime, setListeningTime] = useState(0);

  const t = translations[lang];

  const [messages, setMessages] = useState(() => [
    { sender: 'bot', type: 'text', text: translations.en.botMsg, time: 'Today' },
    { sender: 'user', type: 'text', text: translations.en.userQuery, time: 'Today' },
    { sender: 'bot', type: 'storageCard', time: 'Today' }
  ]);

  useEffect(() => {
    setMessages(prev => {
      const updated = [...prev];
      if (updated[0] && updated[0].sender === 'bot' && updated[0].type === 'text') {
        updated[0].text = t.botMsg;
      }
      if (updated[1] && updated[1].sender === 'user' && updated[1].type === 'text') {
        updated[1].text = t.userQuery;
      }
      return updated;
    });
  }, [lang]);

  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, showVoiceOverlay]);

  useEffect(() => {
    let timer;
    if (showVoiceOverlay) {
      timer = setInterval(() => {
        setListeningTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showVoiceOverlay]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${t.listening} ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const newMessages = [...messages, { sender: 'user', type: 'text', text: text, time: t.today }];
    setMessages(newMessages);
    setInputValue('');

    setTimeout(() => {
      let botReply = `I found your request regarding "${text}". Would you like to reserve a slot?`;
      const lowerText = text.toLowerCase();

      if (lowerText.includes('book') || lowerText.includes('vijaya') || lowerText.includes('1') || lowerText.includes('yes') || lowerText.includes('అవును')) {
        botReply = t.bookingConfirmed;
      } else if (lowerText.includes('compare') || lowerText.includes('price') || lowerText.includes('ధర')) {
        botReply = t.comparing;
      } else if (lowerText.includes('other') || lowerText.includes('store') || lowerText.includes('స్టోర్లు')) {
        botReply = t.otherOptions;
      }

      setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: botReply, time: t.today }]);
    }, 600);
  };

  const handleActionClick = (actionType) => {
    let userActionText = '';
    let botReplyText = '';

    if (actionType === 'book') {
      userActionText = t.bookNow;
      botReplyText = t.bookingConfirmed;
    } else if (actionType === 'compare') {
      userActionText = t.comparePrices;
      botReplyText = t.comparing;
    } else if (actionType === 'others') {
      userActionText = t.otherStores;
      botReplyText = t.otherOptions;
    }

    setMessages(prev => [
      ...prev,
      { sender: 'user', type: 'text', text: userActionText, time: t.today },
      { sender: 'bot', type: 'text', text: botReplyText, time: t.today }
    ]);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'te' : 'en');
  };

  return (
    <div className="chat-app" style={{ width: '100%', maxWidth: '430px', minWidth: '430px', margin: '0 auto', boxSizing: 'border-box' }}>

      {/* Top Global Header Bar matching Router.tsx */}
      <div style={{ background: '#12502E', padding: '12px 20px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', width: '100%' }}>
        <button
          className="back-button"
          onClick={onBack}
          aria-label="Back"
          style={{ width: '38px', height: '38px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          dangerouslySetInnerHTML={{ __html: BACK_SVG }}
        ></button>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={onBack}
            style={{ background: '#ffffff', color: '#12502E', border: 'none', borderRadius: '10px', padding: '6px 12px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
          >
            {t.dashboardBtn}
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            {t.logoutBtn}
          </button>
        </div>
      </div>

      <header className="chat-header" style={{ background: '#12502E', padding: '16px 20px 20px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxSizing: 'border-box', width: '100%' }}>
        <span className="logo" style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: WHEAT_LOGO_SVG }}></span>
        <div className="header-text" style={{ flex: 1, minWidth: 0 }}>
          <span className="advisor-name" style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', display: 'block' }}>{t.advisorName}</span>
          <span className="advisor-subtitle" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', display: 'block' }}>{t.subtitle}</span>
        </div>
        <div className="header-controls" style={{ flexShrink: 0 }}>
          <button onClick={toggleLanguage} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', padding: '6px 10px', cursor: 'pointer', fontWeight: 800, fontSize: '12px' }}>
            {t.langToggle}
          </button>
        </div>
      </header>

      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((msg, index) => {
          if (msg.type === 'text') {
            return (
              <div key={index} className={`message-group ${msg.sender === 'bot' ? 'bot-message-group' : 'user-message-group'}`}>
                <div className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
                  {msg.text}
                </div>
                <div className="timestamp">{msg.time}</div>
              </div>
            );
          } else if (msg.type === 'storageCard') {
            return (
              <div key={index} className="message-group bot-message-group storage-option-group">
                <div className="timestamp">{msg.time}</div>
                <div className="bot-message storage-option-card">
                  <p className="storage-question">{t.storeQuestion}</p>
                  <div className="storage-details">
                      <span className="logo storage-logo" style={{ backgroundColor: '#E6EFE8', color: '#12502E', display: 'flex', alignItems: 'center', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: WHEAT_LOGO_SVG }}></span>
                      <div className="storage-text">
                          <p className="storage-name">{t.storeName}</p>
                          <p className="storage-location">{t.storeLocation}</p>
                      </div>
                      <div className="storage-price-block">
                          <p className="price">₹38</p>
                          <p className="unit">{t.priceUnit}</p>
                      </div>
                  </div>
                  <p className="booking-prompt">{t.bookingPrompt}</p>
                </div>
                <div className="action-buttons">
                  <button className="action-btn primary-btn" onClick={() => handleActionClick('book')}>{t.bookNow}</button>
                  <button className="action-btn secondary-btn" onClick={() => handleActionClick('compare')}>{t.comparePrices}</button>
                  <button className="action-btn secondary-btn" onClick={() => handleActionClick('others')}>{t.otherStores}</button>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      <footer className="chat-footer">
        <input
          type="text"
          className="message-input"
          placeholder={t.typePlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="icon-button mic-button" onClick={() => setShowVoiceOverlay(true)} dangerouslySetInnerHTML={{ __html: MIC_SVG }}></button>
        <button className="icon-button send-button" onClick={() => handleSendMessage()} dangerouslySetInnerHTML={{ __html: SEND_SVG }}></button>
      </footer>

      {showVoiceOverlay && (
        <div className="voice-overlay-backdrop" onClick={() => setShowVoiceOverlay(false)}>
          <div className="voice-overlay-content" onClick={(e) => e.stopPropagation()}>
            <div className="listening-timer">
                <span className="red-dot"></span>
                {formatTime(listeningTime)}
            </div>

            <p className="overlay-text-prompt">{t.userQuery}</p>

            <div className="soundwave">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className="wave-bar"
                        style={{
                            animationDelay: `${i * 0.05}s`,
                            height: `${Math.random() * 30 + 10}px`
                        }}
                    />
                ))}
            </div>

            <div className="overlay-actions">
              <button className="overlay-control-btn cancel-btn" onClick={() => setShowVoiceOverlay(false)}>
                <span className="icon">✕</span>
                {t.cancel}
              </button>
              <button className="overlay-control-btn mic-stop-btn" onClick={() => { setShowVoiceOverlay(false); handleSendMessage(t.userQuery); }}>
                <span className="icon" dangerouslySetInnerHTML={{ __html: MIC_SVG }}></span>
                {t.tapToStop}
              </button>
              <button className="overlay-control-btn send-btn" onClick={() => { setShowVoiceOverlay(false); handleSendMessage(t.userQuery); }}>
                <span className="icon" dangerouslySetInnerHTML={{ __html: SEND_SVG }}></span>
                {t.send}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;