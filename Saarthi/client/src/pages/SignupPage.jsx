// // ========== client/src/pages/SignupPage.jsx ==========
// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useTranslation } from '../hooks/useTranslation';
// import VoiceRecorder from '../components/Auth/VoiceRecorder';
// import api from '../utils/api';
// import { DEMO_OTP } from '../utils/constants';

// const SignupPage = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
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

//   const handleSignup = async () => {
//     if (!voiceData) {
//       setError('Please record your voice first');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await api.post('/auth/signup', {
//         mobile,
//         otp,
//         voice_data: voiceData
//       });

//       if (response.data.success) {
//         alert(response.data.message);
//         // CRITICAL: Redirect to login, NOT dashboard
//         navigate('/login');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Signup failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-container">
//         <h1>{t('auth.signup')}</h1>
        
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
//             <VoiceRecorder onRecordComplete={handleVoiceRecorded} mode="enrollment" />
//             <button
//               onClick={handleSignup}
//               disabled={!voiceData || loading}
//               className="btn-primary"
//             >
//               {loading ? t('common.loading') : t('auth.signup')}
//             </button>
//           </div>
//         )}

//         <p className="auth-link">
//           {t('auth.alreadyHaveAccount')} <Link to="/login">{t('auth.login')}</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;



// ========== client/src/pages/SignupPage.jsx ==========
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import LanguageToggle from '../components/Layout/LanguageToggle';
import VoiceRecorder from '../components/Auth/VoiceRecorder';
import api from '../utils/api';
import { DEMO_OTP } from '../utils/constants';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mobileNumber: '',
    otp: '',
    userName: ''
  });
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (formData.mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (formData.otp !== DEMO_OTP) {
      setError(`Invalid OTP. Use ${DEMO_OTP} for demo`);
      return;
    }
    setError('');
    setStep(3);
  };

  const handleUserNameSubmit = (e) => {
    e.preventDefault();
    if (!formData.userName.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');
    setStep(4);
  };

  const handleVoiceRecorded = (blob) => {
    setAudioBlob(blob);
  };

  const handleSignup = async () => {
    if (!audioBlob) {
      setError('Please record your voice first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('mobileNumber', formData.mobileNumber);
      formDataToSend.append('otp', formData.otp);
      formDataToSend.append('userName', formData.userName);
      formDataToSend.append('audio', audioBlob, 'voice.wav');

      const response = await api.post('/auth/signup', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert(t('auth.signupSuccess'));
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
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
        <h1>{t('auth.signup')}</h1>
        
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
          <div className={`step-dot ${step >= 4 ? 'active' : ''}`}>4</div>
        </div>

        {error && <div className="error">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleMobileSubmit}>
            <label>{t('auth.mobileNumber')}</label>
            <input
              type="tel"
              placeholder={t('auth.enterMobile')}
              value={formData.mobileNumber}
              onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
              maxLength="10"
              required
            />
            <button type="submit" className="btn-primary">{t('common.submit')}</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <p className="info-text">OTP sent to {formData.mobileNumber}</p>
            <label>{t('auth.otp')}</label>
            <input
              type="text"
              placeholder={t('auth.enterOtp')}
              value={formData.otp}
              onChange={(e) => setFormData({...formData, otp: e.target.value})}
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
          <form onSubmit={handleUserNameSubmit}>
            <label>{t('profile.name')}</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
              required
            />
            <button type="submit" className="btn-primary">{t('common.submit')}</button>
            <button type="button" onClick={() => setStep(2)} className="btn-secondary">
              {t('common.back')}
            </button>
          </form>
        )}

        {step === 4 && (
          <div>
            <VoiceRecorder onRecordComplete={handleVoiceRecorded} mode="enrollment" />
            <div className="button-group">
              <button
                onClick={handleSignup}
                disabled={!audioBlob || loading}
                className="btn-primary"
              >
                {loading ? t('common.loading') : t('auth.signup')}
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn-secondary">
                {t('common.back')}
              </button>
            </div>
          </div>
        )}

        <p className="auth-link">
          {t('auth.alreadyHaveAccount')} <Link to="/login">{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;