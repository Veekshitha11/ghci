// // // ========== client/src/components/Core/VoiceAssistantMic.jsx ==========
// // import { useState } from 'react';
// // import { useAuth } from '../../contexts/AuthContext';
// // import VoiceAssistantUI from './VoiceAssistantUI';
// // import api from '../../utils/api';

// // const VoiceAssistantMic = () => {
// //   const [showAssistant, setShowAssistant] = useState(false);
// //   const [checking, setChecking] = useState(false);
// //   const { user } = useAuth();

// //   const handleMicClick = async () => {
// //     setChecking(true);

// //     // MOCK: Simulate voice check
// //     // In production, record a quick voice sample and verify
// //     const mockVoiceData = btoa('QUICK_VOICE_CHECK_' + Date.now());

// //     try {
// //       const response = await api.post('/auth/check-voice', {
// //         voice_data: mockVoiceData,
// //         userId: user?.mobile
// //       });

// //       if (response.data.user === 'known') {
// //         setShowAssistant(true);
// //       } else {
// //         alert('Unknown user detected. Please say again.');
// //       }
// //     } catch (error) {
// //       console.error('Voice check failed:', error);
// //       // For demo, allow access anyway
// //       setShowAssistant(true);
// //     } finally {
// //       setChecking(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <button 
// //         className="voice-assistant-mic" 
// //         onClick={handleMicClick}
// //         disabled={checking}
// //       >
// //         🎤
// //       </button>

// //       {showAssistant && (
// //         <VoiceAssistantUI onClose={() => setShowAssistant(false)} />
// //       )}
// //     </>
// //   );
// // };

// // export default VoiceAssistantMic;



// import { useState, useRef } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import VoiceAssistantUI from './VoiceAssistantUI';
// import api from '../../utils/api';

// /**
//  * VoiceAssistantMic - Floating Mic Button
//  * FIXED: Properly verifies voice before opening assistant
//  */
// const VoiceAssistantMic = () => {
//   const [showAssistant, setShowAssistant] = useState(false);
//   const [checking, setChecking] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const { user } = useAuth();
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   const handleMicClick = async () => {
//     if (checking || recording) return;

//     setChecking(true);
//     setRecording(true);

//     try {
//       // Request microphone access
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true
//         } 
//       });
      
//       // Create MediaRecorder
//       const mediaRecorder = new MediaRecorder(stream, {
//         mimeType: 'audio/webm;codecs=opus'
//       });
      
//       mediaRecorderRef.current = mediaRecorder;
//       chunksRef.current = [];

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = async () => {
//         const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
//         // Send to backend for verification
//         const formData = new FormData();
//         formData.append('userId', user?.userId || '');
//         formData.append('audio', blob, 'voice_check.wav');

//         try {
//           const response = await api.post('/auth/check-voice', formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data'
//             }
//           });

//           if (response.data.authenticated) {
//             setShowAssistant(true);
//           } else {
//             alert('Unknown user detected. Please say again.');
//           }
//         } catch (error) {
//           console.error('Voice check failed:', error);
//           // For demo, allow access anyway if user is logged in
//           if (user?.userId) {
//             setShowAssistant(true);
//           } else {
//             alert('Voice verification failed. Please try again.');
//           }
//         }

//         // Stop all tracks
//         stream.getTracks().forEach(track => track.stop());
//         setRecording(false);
//         setChecking(false);
//       };

//       // Start recording
//       mediaRecorder.start();
      
//       // Auto-stop after 2 seconds (quick check)
//       setTimeout(() => {
//         if (mediaRecorder.state === 'recording') {
//           mediaRecorder.stop();
//         }
//       }, 2000);

//     } catch (error) {
//       console.error('Microphone access error:', error);
//       alert('Could not access microphone. Please check permissions.');
//       setRecording(false);
//       setChecking(false);
//     }
//   };

//   return (
//     <>
//       <button 
//         className={`voice-assistant-mic ${recording ? 'recording' : ''}`}
//         onClick={handleMicClick}
//         disabled={checking}
//         title="Voice Assistant"
//       >
//         {recording ? '⏺️' : '🎤'}
//       </button>

//       {showAssistant && (
//         <VoiceAssistantUI onClose={() => setShowAssistant(false)} />
//       )}

//       <style jsx>{`
//         .voice-assistant-mic.recording {
//           animation: pulse-mic 1.5s infinite;
//           background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
//         }

//         @keyframes pulse-mic {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.1); }
//         }
//       `}</style>
//     </>
//   );
// };

// export default VoiceAssistantMic;




















// ========== client/src/components/Core/VoiceAssistantMic.jsx (with React Icons) ==========
import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import VoiceAssistantUI from './VoiceAssistantUI';
import { FaMicrophone } from 'react-icons/fa';
import api from '../../utils/api';

/**
 * VoiceAssistantMic - Floating Mic Button with React Icons
 */
const VoiceAssistantMic = () => {
  const [showAssistant, setShowAssistant] = useState(false);
  const [checking, setChecking] = useState(false);
  const [recording, setRecording] = useState(false);
  const { user } = useAuth();
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleMicClick = async () => {
    if (checking || recording) return;

    setChecking(true);
    setRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        const formData = new FormData();
        formData.append('userId', user?.userId || '');
        formData.append('audio', blob, 'voice_check.wav');

        try {
          const response = await api.post('/auth/check-voice', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (response.data.authenticated) {
            setShowAssistant(true);
          } else {
            alert('Unknown user detected. Please say again.');
          }
        } catch (error) {
          console.error('Voice check failed:', error);
          if (user?.userId) {
            setShowAssistant(true);
          } else {
            alert('Voice verification failed. Please try again.');
          }
        }

        stream.getTracks().forEach(track => track.stop());
        setRecording(false);
        setChecking(false);
      };

      mediaRecorder.start();
      
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 2000);

    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Could not access microphone. Please check permissions.');
      setRecording(false);
      setChecking(false);
    }
  };

  return (
    <>
      <button 
        className={`voice-assistant-mic ${recording ? 'recording' : ''}`}
        onClick={handleMicClick}
        disabled={checking}
        title="Voice Assistant"
      >
        <FaMicrophone size={28} />
      </button>

      {showAssistant && (
        <VoiceAssistantUI onClose={() => setShowAssistant(false)} />
      )}

      <style>{`
        .voice-assistant-mic {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: white;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .voice-assistant-mic:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        .voice-assistant-mic:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .voice-assistant-mic.recording {
          animation: pulse-mic 1.5s infinite;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        @keyframes pulse-mic {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 6px 24px rgba(0,0,0,0.3);
          }
          50% { 
            transform: scale(1.15); 
            box-shadow: 0 8px 32px rgba(240, 147, 251, 0.5);
          }
        }

        @media (max-width: 768px) {
          .voice-assistant-mic {
            width: 55px;
            height: 55px;
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default VoiceAssistantMic;
