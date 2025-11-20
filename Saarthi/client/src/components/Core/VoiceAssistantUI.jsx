// // ========== client/src/components/Core/VoiceAssistantUI.jsx ==========
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from '../../hooks/useTranslation';
// import { useLanguage } from '../../contexts/LanguageContext';
// import { useAuth } from '../../contexts/AuthContext';
// import MpinModal from './MpinModal';
// import api from '../../utils/api';

// const VoiceAssistantUI = ({ onClose }) => {
//   const { t } = useTranslation();
//   const { language } = useLanguage();
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [isListening, setIsListening] = useState(false);
//   const [userQuery, setUserQuery] = useState('');
//   const [assistantResponse, setAssistantResponse] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showMpinModal, setShowMpinModal] = useState(false);
//   const [pendingAction, setPendingAction] = useState(null);

//   const startListening = () => {
//     setIsListening(true);
    
//     // MOCK: Simulate speech recognition
//     // In production, use Web Speech API
//     setTimeout(() => {
//       const mockQuery = "What is my balance?";
//       setUserQuery(mockQuery);
//       setIsListening(false);
//       handleQuery(mockQuery);
//     }, 2000);
//   };

//   const handleQuery = async (query) => {
//     setLoading(true);

//     try {
//       const response = await api.post('/assistant/ask', {
//         queryText: query,
//         language,
//         mobile: user?.mobile
//       });

//       const { type, textResponse, target, requiresMpin, data } = response.data;

//       setAssistantResponse(textResponse);

//       // Handle different response types
//       if (type === 'navigation') {
//         setTimeout(() => {
//           navigate(target);
//           onClose();
//         }, 1500);
//       } else if (requiresMpin) {
//         setPendingAction({ type, data });
//         setShowMpinModal(true);
//       }
//     } catch (error) {
//       setAssistantResponse('Sorry, I could not process your request.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMpinVerified = () => {
//     setShowMpinModal(false);
//     setAssistantResponse('Action completed successfully!');
//     // Handle the pending action here
//   };

//   return (
//     <div className="voice-assistant-modal">
//       <div className="modal-overlay" onClick={onClose} />
//       <div className="modal-content">
//         <button className="close-btn" onClick={onClose}>×</button>
        
//         <h2>{t('voiceAssistant.greeting')}</h2>

//         <div className="assistant-conversation">
//           {userQuery && (
//             <div className="message user-message">
//               <strong>You:</strong> {userQuery}
//             </div>
//           )}
          
//           {assistantResponse && (
//             <div className="message assistant-message">
//               <strong>Assistant:</strong> {assistantResponse}
//             </div>
//           )}
//         </div>

//         <div className="assistant-controls">
//           {isListening ? (
//             <div className="listening-indicator">
//               <div className="pulse"></div>
//               <p>{t('voiceAssistant.listening')}</p>
//             </div>
//           ) : loading ? (
//             <p>{t('voiceAssistant.processing')}</p>
//           ) : (
//             <button onClick={startListening} className="btn-listen">
//               {t('voiceAssistant.startListening')}
//             </button>
//           )}
//         </div>
//       </div>

//       {showMpinModal && (
//         <MpinModal
//           onVerify={handleMpinVerified}
//           onClose={() => setShowMpinModal(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default VoiceAssistantUI;









// ========== client/src/components/Core/VoiceAssistantUI.jsx ==========
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from '../../hooks/useTranslation';
// import { useLanguage } from '../../contexts/LanguageContext';
// import { useAuth } from '../../contexts/AuthContext';
// import MpinModal from './MpinModel';
// import api from '../../utils/api';

// const VoiceAssistantUI = ({ onClose }) => {
//   const { t } = useTranslation();
//   const { language } = useLanguage();
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [isListening, setIsListening] = useState(false);
//   const [userQuery, setUserQuery] = useState('');
//   const [assistantResponse, setAssistantResponse] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showMpinModal, setShowMpinModal] = useState(false);
//   const [pendingAction, setPendingAction] = useState(null);

//   const startListening = () => {
//     setIsListening(true);
    
//     // MOCK: Simulate speech recognition
//     // In production, use Web Speech API
//     setTimeout(() => {
//       const mockQuery = "What is my balance?";
//       setUserQuery(mockQuery);
//       setIsListening(false);
//       handleQuery(mockQuery);
//     }, 2000);
//   };

//   const handleQuery = async (query) => {
//     setLoading(true);

//     try {
//       const response = await api.post('/assistant/ask', {
//         queryText: query,
//         language,
//         mobile: user?.mobile
//       });

//       const { type, textResponse, target, requiresMpin, data } = response.data;

//       setAssistantResponse(textResponse);

//       // Handle different response types
//       if (type === 'navigation') {
//         setTimeout(() => {
//           navigate(target);
//           onClose();
//         }, 1500);
//       } else if (requiresMpin) {
//         setPendingAction({ type, data });
//         setShowMpinModal(true);
//       }
//     } catch (error) {
//       setAssistantResponse('Sorry, I could not process your request.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMpinVerified = () => {
//     setShowMpinModal(false);
//     setAssistantResponse('Action completed successfully!');
//     // Handle the pending action here
//   };

//   return (
//     <div className="voice-assistant-modal">
//       <div className="modal-overlay" onClick={onClose} />
//       <div className="modal-content">
//         <button className="close-btn" onClick={onClose}>×</button>
        
//         <h2>{t('voiceAssistant.greeting')}</h2>

//         <div className="assistant-conversation">
//           {userQuery && (
//             <div className="message user-message">
//               <strong>You:</strong> {userQuery}
//             </div>
//           )}
          
//           {assistantResponse && (
//             <div className="message assistant-message">
//               <strong>Assistant:</strong> {assistantResponse}
//             </div>
//           )}
//         </div>

//         <div className="assistant-controls">
//           {isListening ? (
//             <div className="listening-indicator">
//               <div className="pulse"></div>
//               <p>{t('voiceAssistant.listening')}</p>
//             </div>
//           ) : loading ? (
//             <p>{t('voiceAssistant.processing')}</p>
//           ) : (
//             <button onClick={startListening} className="btn-listen">
//               {t('voiceAssistant.startListening')}
//             </button>
//           )}
//         </div>
//       </div>

//       {showMpinModal && (
//         <MpinModal
//           onVerify={handleMpinVerified}
//           onClose={() => setShowMpinModal(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default VoiceAssistantUI;
















import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import MpinModal from './MpinModel';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import api from '../../utils/api';

const VoiceAssistantUI = ({ onClose }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [userQuery, setUserQuery] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMpinModal, setShowMpinModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // When transcript changes, process it
  useEffect(() => {
    if (transcript && !isListening) {
      setUserQuery(transcript);
      handleQuery(transcript);
    }
  }, [transcript, isListening]);

  const handleStartListening = () => {
    resetTranscript();
    setUserQuery('');
    setAssistantResponse('');
    startListening();
  };

  const handleQuery = async (query) => {
    setLoading(true);

    try {
      const response = await api.post('/assistant/ask', {
        queryText: query,
        language,
        userId: user?.userId
      });

      const { type, textResponse, target, requiresMpin, data } = response.data;

      setAssistantResponse(textResponse);

      // Handle different response types
      if (type === 'navigation') {
        setTimeout(() => {
          navigate(target);
          onClose();
        }, 1500);
      } else if (requiresMpin) {
        setPendingAction({ type, data });
        setShowMpinModal(true);
      }
    } catch (error) {
      console.error('Query error:', error);
      setAssistantResponse(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const handleMpinVerified = () => {
    setShowMpinModal(false);
    setAssistantResponse('Action completed successfully!');
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="voice-assistant-modal">
        <div className="modal-overlay" onClick={onClose} />
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>Speech Recognition Not Supported</h2>
          <p>Please use a browser that supports speech recognition (Chrome, Edge, Safari).</p>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-assistant-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="assistant-header">
          <h2>{t('voiceAssistant.greeting')}</h2>
          <p className="language-indicator">
            Listening in: {language === 'hi' ? 'हिंदी (Hindi)' : 'English'}
          </p>
        </div>

        <div className="assistant-conversation">
          {userQuery && (
            <div className="message user-message">
              <strong>You:</strong> {userQuery}
            </div>
          )}
          
          {assistantResponse && (
            <div className="message assistant-message">
              <strong>Assistant:</strong> {assistantResponse}
            </div>
          )}

          {speechError && (
            <div className="message error-message">
              <strong>Error:</strong> {speechError}
            </div>
          )}
        </div>

        <div className="assistant-controls">
          {isListening ? (
            <div className="listening-state">
              <div className="pulse-animation">
                <FaMicrophone size={40} />
              </div>
              <p className="status-text">{t('voiceAssistant.listening')}</p>
              <button onClick={stopListening} className="btn-stop">
                <FaStop /> {t('voiceAssistant.stopListening')}
              </button>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>{t('voiceAssistant.processing')}</p>
            </div>
          ) : (
            <button onClick={handleStartListening} className="btn-listen">
              <FaMicrophone /> {t('voiceAssistant.startListening')}
            </button>
          )}
        </div>
      </div>

      {showMpinModal && (
        <MpinModal
          onVerify={handleMpinVerified}
          onClose={() => setShowMpinModal(false)}
        />
      )}

      <style>{`
        .language-indicator {
          font-size: 13px;
          color: #666;
          margin-top: 5px;
        }

        .listening-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .pulse-animation {
          animation: pulse-icon 1.5s infinite;
          color: var(--danger-color);
        }

        @keyframes pulse-icon {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }

        .status-text {
          font-size: 16px;
          font-weight: 600;
          color: var(--dark-color);
        }

        .btn-stop {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 25px;
          border: none;
          border-radius: 25px;
          background: var(--danger-color);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-stop:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .error-message {
          background: #fee;
          border-left: 4px solid #dc3545;
        }
      `}</style>
    </div>
  );
};

export default VoiceAssistantUI;