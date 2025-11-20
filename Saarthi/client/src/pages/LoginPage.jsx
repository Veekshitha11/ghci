// // ========== client/src/pages/LoginPage.jsx ==========
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from '../hooks/useTranslation';
// import { useAuth } from '../contexts/AuthContext';
// import VoiceRecorder from '../components/Auth/VoiceRecorder';
// import api from '../utils/api';
// import { DEMO_OTP } from '../utils/constants';

// const LoginPage = () => {
//   const { t } = useTranslation();
//   const { login } = useAuth();
//   const [step, setStep] = useState(1);
//   const [mobile, setMobile] = useState('');
//   const [otp, setOtp] = useState('');
//   const [voiceData, setVoiceData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleMobileSubmit = (e) => {
//     e.preventDefault();
//     if (mobile.length !== 10) {
//       setError('Please enter a valid 10-digit mobile number');
//       return;
//     }
//     setStep(2);
//   };

//   const handleOtpSubmit = (e) => {
//     e.preventDefault();
//     if (otp !== DEMO_OTP) {
//       setError('Invalid OTP. Use 123456 for demo');
//       return;
//     }
//     setStep(3);
//   };

//   const handleVoiceRecorded = (data) => {
//     setVoiceData(data);
//   };

//   const handleLogin = async () => {
//     if (!voiceData) {
//       setError('Please record your voice first');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await api.post('/auth/login', {
//         mobile,
//         otp,
//         voice_data: voiceData
//       });

//       if (response.data.success && response.data.match) {
//         login(response.data.user, response.data.token);
//       } else {
//         setError(response.data.message || t('auth.voiceNotMatching'));
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-container">
//         <h1>{t('auth.login')}</h1>
        
//         {error && <div className="error">{error}</div>}

//         {step === 1 && (
//           <form onSubmit={handleMobileSubmit}>
//             <input
//               type="tel"
//               placeholder={t('auth.enterMobile')}
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               maxLength="10"
//               required
//             />
//             <button type="submit">{t('common.submit')}</button>
//           </form>
//         )}

//         {step === 2 && (
//           <form onSubmit={handleOtpSubmit}>
//             <p>OTP sent to {mobile}</p>
//             <input
//               type="text"
//               placeholder={t('auth.enterOtp')}
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               maxLength="6"
//               required
//             />
//             <p className="hint">Demo OTP: 123456</p>
//             <button type="submit">{t('common.submit')}</button>
//           </form>
//         )}

//         {step === 3 && (
//           <div>
//             <VoiceRecorder onRecordComplete={handleVoiceRecorded} mode="verification" />
//             <button
//               onClick={handleLogin}
//               disabled={!voiceData || loading}
//               className="btn-primary"
//             >
//               {loading ? t('common.loading') : t('auth.login')}
//             </button>
//           </div>
//         )}

//         <p className="auth-link">
//           {t('auth.dontHaveAccount')} <Link to="/signup">{t('auth.signup')}</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;






// ========== client/src/pages/LoginPage.jsx ==========
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/Layout/LanguageToggle';
import VoiceRecorder from '../components/Auth/VoiceRecorder';
import api from '../utils/api';
import { DEMO_OTP } from '../utils/constants';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp !== DEMO_OTP) {
      setError(`Invalid OTP. Use ${DEMO_OTP} for demo`);
      return;
    }
    setError('');
    setStep(3);
  };

  const handleVoiceRecorded = (blob) => {
    setAudioBlob(blob);
  };

  const handleLogin = async () => {
    if (!audioBlob) {
      setError('Please record your voice first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('mobileNumber', mobileNumber);
      formData.append('otp', otp);
      formData.append('audio', audioBlob, 'voice.wav');

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success && response.data.match) {
        login(response.data.user, response.data.token);
      } else {
        setError(response.data.message || t('auth.voiceNotMatching'));
        setAudioBlob(null); // Reset audio to allow re-recording
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      
      // If user not found, redirect to signup
      if (err.response?.status === 404) {
        setTimeout(() => {
          if (window.confirm('User not registered. Would you like to sign up?')) {
            window.location.href = '/signup';
          }
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <Link to="/" className="back-link">← {t('navigation.home')}</Link>
        <LanguageToggle />
      </div>

      <div className="auth-container">
        <h1>{t('auth.login')}</h1>
        
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {error && <div className="error">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleMobileSubmit}>
            <label>{t('auth.mobileNumber')}</label>
            <input
              type="tel"
              placeholder={t('auth.enterMobile')}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              maxLength="10"
              required
            />
            <button type="submit" className="btn-primary">{t('common.submit')}</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <p className="info-text">OTP sent to {mobileNumber}</p>
            <label>{t('auth.otp')}</label>
            <input
              type="text"
              placeholder={t('auth.enterOtp')}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />
            <p className="hint">Demo OTP: {DEMO_OTP}</p>
            <button type="submit" className="btn-primary">{t('common.submit')}</button>
            <button type="button" onClick={() => setStep(1)} className="btn-secondary">
              {t('common.back')}
            </button>
          </form>
        )}

        {step === 3 && (
          <div>
            <VoiceRecorder onRecordComplete={handleVoiceRecorded} mode="verification" />
            <div className="button-group">
              <button
                onClick={handleLogin}
                disabled={!audioBlob || loading}
                className="btn-primary"
              >
                {loading ? t('common.loading') : t('auth.login')}
              </button>
              <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                {t('common.back')}
              </button>
            </div>
          </div>
        )}

        <p className="auth-link">
          {t('auth.dontHaveAccount')} <Link to="/signup">{t('auth.signup')}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;