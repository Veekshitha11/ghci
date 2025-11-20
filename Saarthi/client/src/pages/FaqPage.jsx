// // ========== client/src/pages/FaqPage.jsx ==========
// import { useState } from 'react';
// import { useTranslation } from '../hooks/useTranslation';
// import Navbar from '../components/Layout/Navbar';
// import api from '../utils/api';

// const FaqPage = () => {
//   const { t } = useTranslation();
//   const [query, setQuery] = useState('');
//   const [answer, setAnswer] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleAsk = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await api.post('/faq/ask', { queryText: query });
//       setAnswer(response.data.answer);
//     } catch (error) {
//       setAnswer('Failed to get answer. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page">
//       <Navbar />
//       <div className="container">
//         <h2>{t('faq.title')}</h2>
        
//         <form onSubmit={handleAsk} className="faq-search">
//           <input
//             type="text"
//             placeholder={t('faq.askQuestion')}
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             required
//           />
//           <button type="submit" disabled={loading}>
//             {loading ? t('common.loading') : t('faq.search')}
//           </button>
//         </form>

//         {answer && (
//           <div className="faq-answer">
//             <h3>Answer:</h3>
//             <p>{answer}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FaqPage;











import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext'; // CRITICAL: Import LanguageContext
import Navbar from '../components/Layout/Navbar';
import { FaQuestionCircle, FaSearch, FaVolumeUp, FaStop } from 'react-icons/fa';
import api from '../utils/api';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const FaqPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage(); // Get current language for TTS
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceFriendlyError = 'Saarthi is thinking... please try again.';
  const {
    isListening,
    transcript,
    error: micError,
    startListening,
    stopListening: stopMic,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const faqList = [
    {
      question: "How to link my ATM card?",
      answer: "Go to Dashboard → Click 'Link ATM' → Enter your card details → Verify with OTP"
    },
    {
      question: "How to set mPIN?",
      answer: "After linking your ATM, you'll be prompted to set a 4-digit mPIN for security"
    },
    {
      question: "How to create UPI ID?",
      answer: "After setting mPIN, you'll be guided to create your unique UPI ID"
    },
    {
      question: "How to use voice assistant?",
      answer: "Click the microphone icon at the bottom-right corner and speak your query"
    },
    {
      question: "Voice not working?",
      answer: "Make sure microphone permissions are enabled. Switch language if needed (EN/हिं)"
    }
  ];

  /**
   * TEXT-TO-SPEECH FUNCTION
   * CRITICAL: Sets language based on user's selected language
   */
  const speakAnswer = useCallback((textToSpeak, lang) => {
    // Stop any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // CRITICAL PART: Set the language for TTS
    if (lang === 'hi') {
      utterance.lang = 'hi-IN'; // Hindi (India)
    } else {
      utterance.lang = 'en-US'; // English (US)
    }

    // Optional: Adjust speech properties
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    // Speak the text
    window.speechSynthesis.speak(utterance);
  }, []);

  /**
   * Stop speaking
   */
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const askFaq = useCallback(async (questionText) => {
    const trimmed = questionText.trim();
    if (!trimmed) return;

    setLoading(true);
    setAnswer('');
    stopSpeaking();

    const payload = { queryText: trimmed };
    console.log('[FAQ] payload → /faq/predict', payload);

    try {
      const response = await api.post('/faq/predict', payload);
      console.log('[FAQ] response ← /faq/predict', response.data);
      const incomingAnswer = response.data.answer?.trim();

      if (incomingAnswer) {
        setAnswer(incomingAnswer);
        speakAnswer(incomingAnswer, language);
      } else {
        setAnswer(voiceFriendlyError);
      }
    } catch (error) {
      console.error('[FAQ] request failed:', error?.response || error);
      setAnswer(voiceFriendlyError);
    } finally {
      setLoading(false);
    }
  }, [language, speakAnswer, stopSpeaking, voiceFriendlyError]);

  /**
   * Handle FAQ query submission
   */
  const handleAsk = async (e) => {
    e.preventDefault();
    await askFaq(query);
  };

  /**
   * Handle clicking on a FAQ item
   */
  const handleFaqClick = (faq) => {
    setQuery(faq.question);
    setAnswer(faq.answer);
    stopSpeaking();
    speakAnswer(faq.answer, language);
  };

  const handleMicToggle = () => {
    if (!browserSupportsSpeechRecognition) {
      setAnswer('Voice input is not supported on this device. Please type your question.');
      return;
    }
    resetTranscript();
    if (isListening) {
      stopMic();
    } else {
      setAnswer('');
      startListening();
    }
  };

  useEffect(() => {
    if (!isListening && transcript) {
      setQuery(transcript);
      askFaq(transcript);
    }
  }, [askFaq, isListening, transcript]);

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="page-header">
          <FaQuestionCircle size={40} color="white" />
          <h2 style={{ color: 'white' }}>{t('faq.title')}</h2>
        </div>
        
        <div className="faq-container">
          {/* Search Box */}
          <form onSubmit={handleAsk} className="faq-search">
            <div className="faq-input-wrapper">
              <input
                type="text"
                placeholder={t('faq.askQuestion')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="button"
                className={` mic-toggle ${isListening ? 'active' : ''}`}
                onClick={handleMicToggle}
                aria-label="Ask with your voice"
              >
                🎤
              </button>
            </div>
            <button type="submit" disabled={loading}>
              <FaSearch /> {loading ? t('common.loading') : t('faq.search')}
            </button>
          </form>

          <div className="listening-status">
            {isListening && <span className="listening-chip">Listening…</span>}
            {micError && <span className="listening-chip error">Mic error: {micError}</span>}
          </div>

          {/* Answer Display with Read Aloud Button */}
          {answer && (
            <div className="faq-answer">
              <div className="answer-header">
                <h3>Answer:</h3>
                <div className="answer-controls">
                  {isSpeaking ? (
                    <button 
                      onClick={stopSpeaking}
                      className="speak-button stop"
                      aria-label="Stop reading"
                    >
                      <FaStop /> Stop
                    </button>
                  ) : (
                    <button 
                      onClick={() => speakAnswer(answer, language)} 
                      className="speak-button"
                      aria-label="Read answer aloud"
                    >
                      <FaVolumeUp /> Read Aloud
                    </button>
                  )}
                </div>
              </div>
              <p className="answer-text">{answer}</p>
              <div className="language-indicator">
                🔊 Speaking in: {language === 'hi' ? 'हिंदी (Hindi)' : 'English'}
              </div>
            </div>
          )}

          {/* FAQ List */}
          <div className="faq-list">
            <h3>Common Questions</h3>
            {faqList.map((faq, index) => (
              <div 
                key={index} 
                className="faq-item"
                onClick={() => handleFaqClick(faq)}
              >
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .page-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
        }

        .faq-container {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .faq-search {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
        }

        .faq-input-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .faq-search input {
          flex: 1;
          padding: 12px 50px 12px 15px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
        }

        .mic-toggle {
          position: absolute;
          right: 10px;
          border: none;
          background: transparent;
          font-size: 18px;
          cursor: pointer;
          color: #475569;
        }

        .mic-toggle.active {
          color: #dc2626;
          animation: pulse-speak 1s infinite;
        }

        .faq-search button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .faq-search button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .faq-search button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .listening-status {
          min-height: 24px;
          margin-top: -10px;
        }

        .listening-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 999px;
          background: #ecfeff;
          color: #0369a1;
          font-size: 13px;
          font-weight: 600;
        }

        .listening-chip.error {
          background: #fee2e2;
          color: #b91c1c;
        }

        .faq-answer {
          background: #e3f2fd;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          border-left: 4px solid var(--primary-color);
        }

        .answer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .answer-header h3 {
          margin: 0;
          color: var(--primary-color);
        }

        .answer-controls {
          display: flex;
          gap: 10px;
        }

        .speak-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 2px solid var(--primary-color);
          border-radius: 20px;
          background: white;
          color: var(--primary-color);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }

        .speak-button:hover {
          background: var(--primary-color);
          color: white;
        }

        .speak-button.stop {
          border-color: var(--danger-color);
          color: var(--danger-color);
          animation: pulse-speak 1.5s infinite;
        }

        .speak-button.stop:hover {
          background: var(--danger-color);
          color: white;
        }

        @keyframes pulse-speak {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .answer-text {
          line-height: 1.8;
          color: #333;
          font-size: 16px;
        }

        .language-indicator {
          margin-top: 10px;
          font-size: 13px;
          color: #666;
          font-style: italic;
        }

        .faq-list h3 {
          margin-bottom: 20px;
          color: var(--dark-color);
        }

        .faq-item {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 15px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .faq-item:hover {
          background: #e9ecef;
          transform: translateX(5px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .faq-item h4 {
          color: var(--primary-color);
          margin-bottom: 10px;
        }

        .faq-item p {
          color: #666;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default FaqPage;