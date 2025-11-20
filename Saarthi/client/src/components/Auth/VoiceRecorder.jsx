// // import { useState, useRef } from 'react';
// // import { useTranslation } from '../../hooks/useTranslation';

// // /**
// //  * VoiceRecorder Component
// //  * Handles voice recording for enrollment and verification
// //  * 
// //  * IMPORTANT: This is a MOCK implementation for demo purposes
// //  * In production, integrate with actual Web Audio API and send real audio data
// //  */
// // const VoiceRecorder = ({ onRecordComplete, mode = 'enrollment' }) => {
// //   const { t } = useTranslation();
// //   const [isRecording, setIsRecording] = useState(false);
// //   const [recordedData, setRecordedData] = useState(null);
// //   const [error, setError] = useState('');
// //   const timerRef = useRef(null);

// //   const startRecording = async () => {
// //     try {
// //       setError('');
      
// //       // Request microphone permission
// //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
// //       // MOCK: In production, use MediaRecorder API
// //       setIsRecording(true);
      
// //       // Auto-stop after 3 seconds (demo)
// //       timerRef.current = setTimeout(() => {
// //         stopRecording();
// //       }, 3000);

// //     } catch (err) {
// //       console.error('Microphone access error:', err);
// //       setError('Microphone access denied. Please allow microphone permissions.');
// //     }
// //   };

// //   const stopRecording = () => {
// //     setIsRecording(false);
    
// //     if (timerRef.current) {
// //       clearTimeout(timerRef.current);
// //     }

// //     // MOCK: Generate fake base64 audio data
// //     // In production, convert actual recorded audio to base64
// //     const mockAudioData = btoa('MOCK_VOICE_DATA_' + Date.now());
// //     setRecordedData(mockAudioData);
    
// //     // Call parent callback with recorded data
// //     onRecordComplete(mockAudioData);
// //   };

// //   const recordAgain = () => {
// //     setRecordedData(null);
// //     setError('');
// //   };

// //   return (
// //     <div className="voice-recorder">
// //       <div className="voice-recorder-container">
// //         <h3>{mode === 'enrollment' ? t('auth.voiceEnrollment') : t('auth.voiceVerification')}</h3>
        
// //         {error && (
// //           <div className="error-message">{error}</div>
// //         )}

// //         {!recordedData ? (
// //           <div className="recording-controls">
// //             <div className={`mic-icon ${isRecording ? 'recording' : ''}`}>
// //               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                 <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
// //                 <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
// //                 <line x1="12" y1="19" x2="12" y2="23"></line>
// //                 <line x1="8" y1="23" x2="16" y2="23"></line>
// //               </svg>
// //             </div>

// //             <div className="recording-status">
// //               {isRecording ? (
// //                 <>
// //                   <div className="pulse-indicator"></div>
// //                   <p>{t('voiceAssistant.listening')}</p>
// //                 </>
// //               ) : (
// //                 <p>{t('auth.recordVoice')}</p>
// //               )}
// //             </div>

// //             <button
// //               type="button"
// //               onClick={isRecording ? stopRecording : startRecording}
// //               className={`btn-record ${isRecording ? 'recording' : ''}`}
// //             >
// //               {isRecording ? t('auth.stopRecording') : t('auth.startRecording')}
// //             </button>
// //           </div>
// //         ) : (
// //           <div className="recording-complete">
// //             <div className="checkmark">✓</div>
// //             <p>{t('auth.voiceRecorded')}</p>
// //             <button
// //               type="button"
// //               onClick={recordAgain}
// //               className="btn-secondary"
// //             >
// //               {t('auth.recordAgain')}
// //             </button>
// //           </div>
// //         )}
// //       </div>

// //       <style jsx>{`
// //         .voice-recorder {
// //           margin: 20px 0;
// //         }

// //         .voice-recorder-container {
// //           background: #f8f9fa;
// //           border-radius: 12px;
// //           padding: 30px;
// //           text-align: center;
// //         }

// //         .voice-recorder-container h3 {
// //           margin-bottom: 20px;
// //           color: #333;
// //         }

// //         .error-message {
// //           background: #fee;
// //           color: #c33;
// //           padding: 10px;
// //           border-radius: 6px;
// //           margin-bottom: 15px;
// //         }

// //         .recording-controls {
// //           display: flex;
// //           flex-direction: column;
// //           align-items: center;
// //           gap: 20px;
// //         }

// //         .mic-icon {
// //           width: 100px;
// //           height: 100px;
// //           border-radius: 50%;
// //           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           color: white;
// //           transition: all 0.3s;
// //         }

// //         .mic-icon.recording {
// //           animation: pulse 1.5s infinite;
// //           background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
// //         }

// //         @keyframes pulse {
// //           0%, 100% { transform: scale(1); opacity: 1; }
// //           50% { transform: scale(1.1); opacity: 0.8; }
// //         }

// //         .recording-status {
// //           min-height: 40px;
// //         }

// //         .pulse-indicator {
// //           width: 12px;
// //           height: 12px;
// //           background: #f5576c;
// //           border-radius: 50%;
// //           margin: 0 auto 10px;
// //           animation: blink 1s infinite;
// //         }

// //         @keyframes blink {
// //           0%, 100% { opacity: 1; }
// //           50% { opacity: 0.3; }
// //         }

// //         .btn-record {
// //           padding: 12px 40px;
// //           border: none;
// //           border-radius: 25px;
// //           font-size: 16px;
// //           font-weight: 600;
// //           cursor: pointer;
// //           transition: all 0.3s;
// //           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //           color: white;
// //         }

// //         .btn-record.recording {
// //           background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
// //         }

// //         .btn-record:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 4px 12px rgba(0,0,0,0.2);
// //         }

// //         .recording-complete {
// //           display: flex;
// //           flex-direction: column;
// //           align-items: center;
// //           gap: 15px;
// //         }

// //         .checkmark {
// //           width: 80px;
// //           height: 80px;
// //           border-radius: 50%;
// //           background: #28a745;
// //           color: white;
// //           font-size: 48px;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           animation: scaleIn 0.5s;
// //         }

// //         @keyframes scaleIn {
// //           from { transform: scale(0); }
// //           to { transform: scale(1); }
// //         }

// //         .btn-secondary {
// //           padding: 10px 30px;
// //           border: 2px solid #667eea;
// //           border-radius: 25px;
// //           background: white;
// //           color: #667eea;
// //           font-size: 14px;
// //           font-weight: 600;
// //           cursor: pointer;
// //           transition: all 0.3s;
// //         }

// //         .btn-secondary:hover {
// //           background: #667eea;
// //           color: white;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default VoiceRecorder;



// import { useState, useRef } from 'react';
// import { useTranslation } from '../../hooks/useTranslation';

// /**
//  * VoiceRecorder Component
//  * Handles REAL voice recording using Web Audio API
//  * Returns audio blob for upload to backend
//  */
// const VoiceRecorder = ({ onRecordComplete, mode = 'enrollment' }) => {
//   const { t } = useTranslation();
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedBlob, setRecordedBlob] = useState(null);
//   const [error, setError] = useState('');
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   const startRecording = async () => {
//     try {
//       setError('');
//       chunksRef.current = [];
      
//       // Request microphone permission
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 44100
//         } 
//       });
      
//       // Create MediaRecorder instance
//       const mediaRecorder = new MediaRecorder(stream, {
//         mimeType: 'audio/webm;codecs=opus'
//       });
      
//       mediaRecorderRef.current = mediaRecorder;

//       // Collect audio data
//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunksRef.current.push(event.data);
//         }
//       };

//       // Handle recording stop
//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
//         setRecordedBlob(blob);
//         onRecordComplete(blob);
        
//         // Stop all tracks
//         stream.getTracks().forEach(track => track.stop());
//       };

//       // Start recording
//       mediaRecorder.start();
//       setIsRecording(true);
      
//       // Auto-stop after 5 seconds (for enrollment, need ~3-5 seconds)
//       setTimeout(() => {
//         if (mediaRecorder.state === 'recording') {
//           stopRecording();
//         }
//       }, 5000);

//     } catch (err) {
//       console.error('Microphone access error:', err);
//       if (err.name === 'NotAllowedError') {
//         setError('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else if (err.name === 'NotFoundError') {
//         setError('No microphone found. Please connect a microphone and try again.');
//       } else {
//         setError('Failed to access microphone. Please try again.');
//       }
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const recordAgain = () => {
//     setRecordedBlob(null);
//     setError('');
//     onRecordComplete(null);
//   };

//   return (
//     <div className="voice-recorder">
//       <div className="voice-recorder-container">
//         <h3>{mode === 'enrollment' ? t('auth.voiceEnrollment') : t('auth.voiceVerification')}</h3>
        
//         {mode === 'enrollment' && (
//           <p className="instruction-text">
//             Please say a full sentence clearly, like: "My voice is my password, verify me"
//           </p>
//         )}
        
//         {error && (
//           <div className="error-message">{error}</div>
//         )}

//         {!recordedBlob ? (
//           <div className="recording-controls">
//             <div className={`mic-icon ${isRecording ? 'recording' : ''}`}>
//               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
//                 <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
//                 <line x1="12" y1="19" x2="12" y2="23"></line>
//                 <line x1="8" y1="23" x2="16" y2="23"></line>
//               </svg>
//             </div>

//             <div className="recording-status">
//               {isRecording ? (
//                 <>
//                   <div className="pulse-indicator"></div>
//                   <p className="status-text">{t('voiceAssistant.listening')}</p>
//                   <p className="status-subtext">Recording... (auto-stops in 5 sec)</p>
//                 </>
//               ) : (
//                 <p className="status-text">{t('auth.recordVoice')}</p>
//               )}
//             </div>

//             <button
//               type="button"
//               onClick={isRecording ? stopRecording : startRecording}
//               className={`btn-record ${isRecording ? 'recording' : ''}`}
//               disabled={isRecording}
//             >
//               {isRecording ? t('voiceAssistant.listening') : t('auth.startRecording')}
//             </button>
//           </div>
//         ) : (
//           <div className="recording-complete">
//             <div className="checkmark">✓</div>
//             <p className="success-text">{t('auth.voiceRecorded')}</p>
//             <p className="info-text">Duration: ~{(recordedBlob.size / 16000).toFixed(1)}s</p>
//             <button
//               type="button"
//               onClick={recordAgain}
//               className="btn-secondary"
//             >
//               {t('auth.recordAgain')}
//             </button>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .voice-recorder {
//           margin: 20px 0;
//         }

//         .voice-recorder-container {
//           background: #f8f9fa;
//           border-radius: 12px;
//           padding: 30px;
//           text-align: center;
//         }

//         .voice-recorder-container h3 {
//           margin-bottom: 15px;
//           color: #333;
//         }

//         .instruction-text {
//           font-size: 14px;
//           color: #666;
//           margin-bottom: 20px;
//           line-height: 1.5;
//         }

//         .error-message {
//           background: #fee;
//           color: #c33;
//           padding: 12px;
//           border-radius: 6px;
//           margin-bottom: 15px;
//           font-size: 14px;
//         }

//         .recording-controls {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 20px;
//         }

//         .mic-icon {
//           width: 100px;
//           height: 100px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           transition: all 0.3s;
//         }

//         .mic-icon.recording {
//           animation: pulse 1.5s infinite;
//           background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
//         }

//         @keyframes pulse {
//           0%, 100% { transform: scale(1); opacity: 1; }
//           50% { transform: scale(1.1); opacity: 0.8; }
//         }

//         .recording-status {
//           min-height: 60px;
//         }

//         .status-text {
//           font-size: 16px;
//           font-weight: 600;
//           color: #333;
//           margin-bottom: 5px;
//         }

//         .status-subtext {
//           font-size: 13px;
//           color: #666;
//         }

//         .pulse-indicator {
//           width: 12px;
//           height: 12px;
//           background: #f5576c;
//           border-radius: 50%;
//           margin: 0 auto 10px;
//           animation: blink 1s infinite;
//         }

//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.3; }
//         }

//         .btn-record {
//           padding: 12px 40px;
//           border: none;
//           border-radius: 25px;
//           font-size: 16px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//         }

//         .btn-record.recording {
//           background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
//         }

//         .btn-record:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0,0,0,0.2);
//         }

//         .btn-record:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }

//         .recording-complete {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 15px;
//         }

//         .checkmark {
//           width: 80px;
//           height: 80px;
//           border-radius: 50%;
//           background: #28a745;
//           color: white;
//           font-size: 48px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           animation: scaleIn 0.5s;
//         }

//         @keyframes scaleIn {
//           from { transform: scale(0); }
//           to { transform: scale(1); }
//         }

//         .success-text {
//           font-size: 16px;
//           font-weight: 600;
//           color: #28a745;
//         }

//         .info-text {
//           font-size: 14px;
//           color: #666;
//         }

//         .btn-secondary {
//           padding: 10px 30px;
//           border: 2px solid #667eea;
//           border-radius: 25px;
//           background: white;
//           color: #667eea;
//           font-size: 14px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s;
//         }

//         .btn-secondary:hover {
//           background: #667eea;
//           color: white;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default VoiceRecorder;


















import { useState, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * VoiceRecorder Component
 * Handles REAL voice recording using Web Audio API
 * Returns audio blob for upload to backend
 */
const VoiceRecorder = ({ onRecordComplete, mode = 'enrollment' }) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      setError('');
      chunksRef.current = [];
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        onRecordComplete(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto-stop after 5 seconds (for enrollment, need ~3-5 seconds)
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopRecording();
        }
      }, 5000);

    } catch (err) {
      console.error('Microphone access error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone permissions in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError('Failed to access microphone. Please try again.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const recordAgain = () => {
    setRecordedBlob(null);
    setError('');
    onRecordComplete(null);
  };

  return (
    <div className="voice-recorder">
      <div className="voice-recorder-container">
        <h3>{mode === 'enrollment' ? t('auth.voiceEnrollment') : t('auth.voiceVerification')}</h3>
        
        {mode === 'enrollment' && (
          <p className="instruction-text">
            Please say a full sentence clearly, like: "My voice is my password, verify me"
          </p>
        )}
        
        {error && (
          <div className="error-message">{error}</div>
        )}

        {!recordedBlob ? (
          <div className="recording-controls">
            <div className={`mic-icon ${isRecording ? 'recording' : ''}`}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </div>

            <div className="recording-status">
              {isRecording ? (
                <>
                  <div className="pulse-indicator"></div>
                  <p className="status-text">{t('voiceAssistant.listening')}</p>
                  <p className="status-subtext">Recording... (auto-stops in 5 sec)</p>
                </>
              ) : (
                <p className="status-text">{t('auth.recordVoice')}</p>
              )}
            </div>

            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`btn-record ${isRecording ? 'recording' : ''}`}
              disabled={isRecording}
            >
              {isRecording ? t('voiceAssistant.listening') : t('auth.startRecording')}
            </button>
          </div>
        ) : (
          <div className="recording-complete">
            <div className="checkmark">✓</div>
            <p className="success-text">{t('auth.voiceRecorded')}</p>
            <p className="info-text">Duration: ~{(recordedBlob.size / 16000).toFixed(1)}s</p>
            <button
              type="button"
              onClick={recordAgain}
              className="btn-secondary"
            >
              {t('auth.recordAgain')}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .voice-recorder {
          margin: 20px 0;
        }

        .voice-recorder-container {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
        }

        .voice-recorder-container h3 {
          margin-bottom: 15px;
          color: #333;
        }

        .instruction-text {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 15px;
          font-size: 14px;
        }

        .recording-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .mic-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s;
        }

        .mic-icon.recording {
          animation: pulse 1.5s infinite;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .recording-status {
          min-height: 60px;
        }

        .status-text {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }

        .status-subtext {
          font-size: 13px;
          color: #666;
        }

        .pulse-indicator {
          width: 12px;
          height: 12px;
          background: #f5576c;
          border-radius: 50%;
          margin: 0 auto 10px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .btn-record {
          padding: 12px 40px;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-record.recording {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .btn-record:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .btn-record:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .recording-complete {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #28a745;
          color: white;
          font-size: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: scaleIn 0.5s;
        }

        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        .success-text {
          font-size: 16px;
          font-weight: 600;
          color: #28a745;
        }

        .info-text {
          font-size: 14px;
          color: #666;
        }

        .btn-secondary {
          padding: 10px 30px;
          border: 2px solid #667eea;
          border-radius: 25px;
          background: white;
          color: #667eea;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background: #667eea;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default VoiceRecorder;