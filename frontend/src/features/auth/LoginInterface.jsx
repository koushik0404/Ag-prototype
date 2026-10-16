import React, { useState, useEffect, useRef } from 'react';
import './LoginInterface.css';

const PHONE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const BACK_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;

const translations = {
  en: {
    signIn: "Sign in",
    signInSubtitle: "Enter your mobile number to get an OTP",
    mobileLabel: "Mobile number",
    smsNotice: "We'll send a 6-digit OTP by SMS. Standard rates may apply.",
    sendOtp: "SEND OTP",
    terms: "By continuing, you agree to our Terms and Privacy Policy",
    verifyOtp: "Verify OTP",
    codeSentTo: "Code sent to",
    enterOtp: "Enter 6-digit OTP",
    resendIn: "Resend OTP in",
    changeNumber: "Change number",
    verify: "VERIFY",
    didntGet: "Didn't get the code?",
    resend: "Resend"
  },
  te: {
    signIn: "సైన్ ఇన్ చేయండి",
    signInSubtitle: "OTP పొందడానికి మీ మొబైల్ నంబర్‌ను నమోదు చేయండి",
    mobileLabel: "మొబైల్ నంబర్",
    smsNotice: "మేము SMS ద్వారా 6-అంకెల OTPని పంపుతాము. ప్రామాణిక రేట్లు వర్తించవచ్చు.",
    sendOtp: "OTP పంపండి",
    terms: "కొనసాగించడం ద్వారా, మీరు మా నిబంధనలు మరియు గోప్యతా విధానానికి అంగీకరిస్తున్నారు",
    verifyOtp: "OTPని ధృవీకరించండి",
    codeSentTo: "కోడ్ పంపబడిన నంబర్",
    enterOtp: "6-అంకెల OTPని నమోదు చేయండి",
    resendIn: "ఇందులో OTPని మళ్లీ పంపండి",
    changeNumber: "నంబర్‌ను మార్చండి",
    verify: "ధృవీకరించండి",
    didntGet: "కోడ్ రాలేదా?",
    resend: "మళ్లీ పంపు"
  }
};

export default function LoginInterface({ onLoginSuccess }) {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [lang, setLang] = useState('en');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState(['4', '7', '2', '', '', '']);
  const [timer, setTimer] = useState(24);
  const inputRefs = useRef([]);

  const t = translations[lang];

  useEffect(() => {
    let interval;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(p => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleOtpChange = (val, index) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="login-container">
      {step === 'phone' ? (
        /* --- 01-sign-in-mobile 1 --- */
        <div className="login-card-wrapper">
          <div className="login-header">
            <div className="lang-selector">
              {[['en', 'EN'], ['te', 'తె']].map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setLang(k)}
                  className={`lang-btn ${lang === k ? 'active' : ''}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <h1>{t.signIn}</h1>
            <p>{t.signInSubtitle}</p>
          </div>

          <div className="login-box">
            <div className="input-group">
              <span className="input-icon" dangerouslySetInnerHTML={{ __html: PHONE_ICON }} />
              <div className="input-content">
                <label>{t.mobileLabel}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <p className="notice-text">{t.smsNotice}</p>

            <button className="primary-action-btn" onClick={() => setStep('otp')}>
              {t.sendOtp}
            </button>

            <div className="footer-terms">{t.terms}</div>
          </div>
        </div>
      ) : (
        /* --- 02-verify-otp 1 --- */
        <div className="login-card-wrapper">
          <div className="login-header">
            <div className="header-top-row">
              <button className="back-btn" onClick={() => setStep('phone')} dangerouslySetInnerHTML={{ __html: BACK_ICON }} />
              <div className="lang-selector">
                {[['en', 'EN'], ['te', 'తె']].map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setLang(k)}
                    className={`lang-btn ${lang === k ? 'active' : ''}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <h1>{t.verifyOtp}</h1>
            <p>{t.codeSentTo} {phone}</p>
          </div>

          <div className="login-box">
            <div className="otp-section-label">{t.enterOtp}</div>

            <div className="otp-inputs-grid">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => inputRefs.current[idx] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className={`otp-digit-box ${digit ? 'filled' : ''}`}
                />
              ))}
            </div>

            <div className="otp-timer-row">
              <span>{t.resendIn} 00:{String(timer).padStart(2, '0')}</span>
              <button className="text-link-btn" onClick={() => setStep('phone')}>{t.changeNumber}</button>
            </div>

            <button className="primary-action-btn" onClick={() => onLoginSuccess && onLoginSuccess()}>
              {t.verify}
            </button>

            <div className="resend-row">
              {t.didntGet} <button className="text-link-btn bold" onClick={() => setTimer(30)}>{t.resend}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}