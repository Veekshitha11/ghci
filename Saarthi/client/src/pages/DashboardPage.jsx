// // // // ========== client/src/pages/DashboardPage.jsx ==========
// // // import { useState, useEffect } from 'react';
// // // import { Link } from 'react-router-dom';
// // // import { useTranslation } from '../hooks/useTranslation';
// // // import { useAuth } from '../contexts/AuthContext';
// // // import Navbar from '../components/Layout/Navbar';
// // // import VoiceAssistantMic from '../components/Core/VoiceAssistantMic';
// // // import BalanceCard from '../components/Dashboard/BalanceCard';
// // // import FdLoanCard from '../components/Dashboard/FdLoanCard';
// // // import RecentTransactions from '../components/Dashboard/RecentTransactions';
// // // import api from '../utils/api';

// // // const DashboardPage = () => {
// // //   const { t } = useTranslation();
// // //   const { user } = useAuth();
// // //   const [dashboardData, setDashboardData] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     fetchDashboardData();
// // //   }, []);

// // //   const fetchDashboardData = async () => {
// // //     try {
// // //       const response = await api.get('/user/details');
// // //       setDashboardData(response.data);
// // //     } catch (error) {
// // //       console.error('Failed to fetch dashboard data:', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return <div className="loading">{t('common.loading')}</div>;
// // //   }

// // //   return (
// // //     <div className="dashboard-page">
// // //       <Navbar />
// // //       <VoiceAssistantMic />

// // //       <div className="dashboard-container">
// // //         <h2>{t('dashboard.welcome')}, {dashboardData?.user?.name || user?.name}!</h2>

// // //         <div className="dashboard-grid">
// // //           <BalanceCard balance={dashboardData?.bankDetails?.balance || 0} />
          
// // //           <FdLoanCard
// // //             title={t('dashboard.myFds')}
// // //             items={dashboardData?.bankDetails?.fds || []}
// // //             type="fd"
// // //           />
          
// // //           <FdLoanCard
// // //             title={t('dashboard.myLoans')}
// // //             items={dashboardData?.bankDetails?.loans || []}
// // //             type="loan"
// // //           />
// // //         </div>

// // //         {!dashboardData?.user?.atmLinked && (
// // //           <div className="prompt-card">
// // //             <p>{t('dashboard.linkAtmPrompt')}</p>
// // //             <Link to="/link-atm" className="btn-primary">{t('navigation.linkAtm')}</Link>
// // //           </div>
// // //         )}

// // //         {!dashboardData?.user?.mpinSet && (
// // //           <div className="prompt-card">
// // //             <p>{t('dashboard.setMpinPrompt')}</p>
// // //           </div>
// // //         )}

// // //         <RecentTransactions transactions={dashboardData?.recentTransactions || []} />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default DashboardPage;


// // import { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import { useTranslation } from '../hooks/useTranslation';
// // import { useAuth } from '../contexts/AuthContext';
// // import Navbar from '../components/Layout/Navbar';
// // import VoiceAssistantMic from '../components/Core/VoiceAssistantMic';
// // import BalanceCard from '../components/Dashboard/BalanceCard';
// // import FdLoanCard from '../components/Dashboard/FdLoanCard';
// // import RecentTransactions from '../components/Dashboard/RecentTransactions';
// // import QuickActions from '../components/Dashboard/QuickActions';
// // import api from '../utils/api';

// // const DashboardPage = () => {
// //   const { t } = useTranslation();
// //   const { user } = useAuth();
// //   const [dashboardData, setDashboardData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     fetchDashboardData();
// //   }, []);

// //   const fetchDashboardData = async () => {
// //     try {
// //       const response = await api.get('/user/details');
// //       console.log('Dashboard data:', response.data);
// //       setDashboardData(response.data);
// //     } catch (error) {
// //       console.error('Failed to fetch dashboard data:', error);
// //       setError('Failed to load dashboard');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="loading-screen">
// //         <div className="spinner"></div>
// //         <p>{t('common.loading')}</p>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="page">
// //         <Navbar />
// //         <div className="container">
// //           <div className="error-screen">
// //             <p>{error}</p>
// //             <button onClick={fetchDashboardData} className="btn-primary">
// //               Retry
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const userData = dashboardData?.user;
// //   const bankDetails = dashboardData?.bankDetails;
// //   const transactions = dashboardData?.recentTransactions || [];

// //   return (
// //     <div className="dashboard-page">
// //       <Navbar />
// //       <VoiceAssistantMic />

// //       <div className="dashboard-container">
// //         <h2 className="welcome-text">
// //           {t('dashboard.welcome')}, {userData?.userName}!
// //         </h2>

// //         {/* Conditional Prompts for New Users */}
// //         {!userData?.isAtmLinked && (
// //           <div className="prompt-card warning">
// //             <div className="prompt-icon">⚠️</div>
// //             <div className="prompt-content">
// //               <h3>{t('dashboard.linkAtmPrompt')}</h3>
// //               <p>Link your ATM card to start using all features</p>
// //               <Link to="/link-atm" className="btn-primary">
// //                 {t('navigation.linkAtm')}
// //               </Link>
// //             </div>
// //           </div>
// //         )}

// //         {userData?.isAtmLinked && !userData?.isMpinSet && (
// //           <div className="prompt-card warning">
// //             <div className="prompt-icon">🔒</div>
// //             <div className="prompt-content">
// //               <h3>{t('dashboard.setMpinPrompt')}</h3>
// //               <p>Set a 4-digit mPIN to secure your transactions</p>
// //               <Link to="/set-mpin" className="btn-primary">
// //                 {t('mpin.setMpin')}
// //               </Link>
// //             </div>
// //           </div>
// //         )}

// //         {/* Quick Actions - CONDITIONAL BASED ON STATE */}
// //         <QuickActions isAtmLinked={userData?.isAtmLinked} />

// //         {/* Balance and Account Details */}
// //         <div className="dashboard-grid">
// //           <BalanceCard balance={bankDetails?.balance || 0} />
          
// //           <FdLoanCard
// //             title={t('dashboard.myFds')}
// //             items={bankDetails?.fds || []}
// //             type="fd"
// //           />
          
// //           <FdLoanCard
// //             title={t('dashboard.myLoans')}
// //             items={bankDetails?.loans || []}
// //             type="loan"
// //           />
// //         </div>

// //         {/* Recent Transactions */}
// //         <RecentTransactions transactions={transactions} />
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardPage;






















// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from '../hooks/useTranslation';
// import { useAuth } from '../contexts/AuthContext';
// import Navbar from '../components/Layout/Navbar';
// import VoiceAssistantMic from '../components/Core/VoiceAssistantMic';
// import BalanceCard from '../components/Dashboard/BalanceCard';
// import FdLoanCard from '../components/Dashboard/FdLoanCard';
// import RecentTransactions from '../components/Dashboard/RecentTransactions';
// import QuickActions from '../components/Dashboard/QuickActions';
// import UpiDisplay from '../components/Dashboard/UpiDisplay';
// import RemindersCard from '../components/Dashboard/RemindersCard';
// import api from '../utils/api';

// const DashboardPage = () => {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await api.get('/user/details');
//       console.log('Dashboard data:', response.data);
//       setDashboardData(response.data);
//     } catch (error) {
//       console.error('Failed to fetch dashboard data:', error);
//       setError('Failed to load dashboard');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-screen">
//         <div className="spinner"></div>
//         <p>{t('common.loading')}</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="page">
//         <Navbar />
//         <div className="container">
//           <div className="error-screen">
//             <p>{error}</p>
//             <button onClick={fetchDashboardData} className="btn-primary">
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const userData = dashboardData?.user;
//   const bankDetails = dashboardData?.bankDetails;
//   const transactions = dashboardData?.recentTransactions || [];
//   const reminders = dashboardData?.reminders || [];

//   return (
//     <div className="dashboard-page">
//       <Navbar />
//       <VoiceAssistantMic />

//       <div className="dashboard-container">
//         {/* Welcome Section */}
//         <div className="welcome-section">
//           <h2 className="welcome-text">
//             {t('dashboard.welcome')}, {userData?.userName}!
//           </h2>
//           <p className="welcome-subtext">
//             {new Date().toLocaleDateString('en-US', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             })}
//           </p>
//         </div>

//         {/* Conditional Prompts for New Users */}
//         {!userData?.isAtmLinked && (
//           <div className="prompt-card warning">
//             <div className="prompt-icon">⚠️</div>
//             <div className="prompt-content">
//               <h3>{t('dashboard.linkAtmPrompt')}</h3>
//               <p>Link your ATM card to start using all features</p>
//               <Link to="/link-atm" className="btn-primary">
//                 {t('navigation.linkAtm')}
//               </Link>
//             </div>
//           </div>
//         )}

//         {userData?.isAtmLinked && !userData?.isMpinSet && (
//           <div className="prompt-card warning">
//             <div className="prompt-icon">🔒</div>
//             <div className="prompt-content">
//               <h3>{t('dashboard.setMpinPrompt')}</h3>
//               <p>Set a 4-digit mPIN to secure your transactions</p>
//               <Link to="/set-mpin" className="btn-primary">
//                 {t('mpin.setMpin')}
//               </Link>
//             </div>
//           </div>
//         )}

//         {userData?.isMpinSet && !userData?.upiId && (
//           <div className="prompt-card info">
//             <div className="prompt-icon">💳</div>
//             <div className="prompt-content">
//               <h3>Create Your UPI ID</h3>
//               <p>Generate your unique UPI ID to receive payments</p>
//               <Link to="/create-upi" className="btn-primary">
//                 Create UPI ID
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Quick Actions */}
//         <QuickActions isAtmLinked={userData?.isAtmLinked} />

//         {/* Main Dashboard Grid - Modern Two-Column Layout */}
//         <div className="dashboard-main-grid">
//           {/* Left Column */}
//           <div className="dashboard-column">
//             <BalanceCard balance={bankDetails?.balance || 0} />
//             <RemindersCard reminders={reminders} />
//           </div>

//           {/* Right Column */}
//           <div className="dashboard-column">
//             {userData?.upiId && (
//               <UpiDisplay 
//                 upiId={userData.upiId} 
//                 qrCodeData={userData.qrCodeData} 
//               />
//             )}
            
//             <FdLoanCard
//               title={t('dashboard.myFds')}
//               items={bankDetails?.fds || []}
//               type="fd"
//             />
            
//             <FdLoanCard
//               title={t('dashboard.myLoans')}
//               items={bankDetails?.loans || []}
//               type="loan"
//             />
//           </div>
//         </div>

//         {/* Recent Transactions - Full Width */}
//         <RecentTransactions transactions={transactions} />
//       </div>

//       <style jsx>{`
//         .welcome-section {
//           margin-bottom: 30px;
//         }

//         .welcome-text {
//           font-size: 32px;
//           font-weight: bold;
//           color: white;
//           margin-bottom: 8px;
//         }

//         .welcome-subtext {
//           color: rgba(255, 255, 255, 0.9);
//           font-size: 16px;
//         }

//         .prompt-card.info {
//           border-left: 5px solid var(--primary-color);
//           background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
//         }

//         .dashboard-main-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 20px;
//           margin-bottom: 30px;
//         }

//         .dashboard-column {
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//         }

//         @media (max-width: 992px) {
//           .dashboard-main-grid {
//             grid-template-columns: 1fr;
//           }

//           .welcome-text {
//             font-size: 24px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DashboardPage;














// ========== client/src/pages/DashboardPage.jsx (UPDATED - Interactive) ==========
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import Navbar from '../components/Layout/Navbar';
import VoiceAssistantMic from '../components/Core/VoiceAssistantMic';
import AccountInfo from '../components/Dashboard/AccountInfo';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import QuickActions from '../components/Dashboard/QuickActions';
import UpiDisplay from '../components/Dashboard/UpiDisplay';
import { useAppState } from '../contexts/AppStateContext';
import api from '../utils/api';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { syncWalletBalance, addedTransactions } = useAppState();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/user/details');
      console.log('Dashboard data:', response.data);
      setDashboardData(response.data);
      if (response.data?.bankDetails?.balance !== undefined) {
        syncWalletBalance(response.data.bankDetails.balance);
      }
    } catch (fetchError) {
      console.error('Failed to fetch dashboard data:', fetchError);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const userData = dashboardData?.user;
  const apiTransactions = dashboardData?.recentTransactions || [];
  const combinedTransactions = useMemo(() => {
    const merged = [...addedTransactions, ...apiTransactions];
    return merged.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [addedTransactions, apiTransactions]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Navbar />
        <div className="container">
          <div className="error-screen">
            <p>{error}</p>
            <button onClick={fetchDashboardData} className="btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <VoiceAssistantMic />

      <div className="dashboard-container">
        <div className="welcome-section">
          <h2 className="welcome-text">
            {t('dashboard.welcome')}, {userData?.userName}!
          </h2>
          <p className="welcome-subtext">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="dashboard-grid-3col">
          <div className="dashboard-main-col">
            <QuickActions isAtmLinked={userData?.isAtmLinked} />
            <AccountInfo user={userData} />

            {!userData?.isAtmLinked && (
              <div className="prompt-card warning">
                <div className="prompt-icon">⚠️</div>
                <div className="prompt-content">
                  <h3>{t('dashboard.linkAtmPrompt')}</h3>
                  <p>Link your ATM card to start using all features</p>
                  <Link to="/link-atm" className="btn-primary large">
                    {t('navigation.linkAtm')}
                  </Link>
                </div>
              </div>
            )}

            {userData?.isAtmLinked && !userData?.isMpinSet && (
              <div className="prompt-card warning">
                <div className="prompt-icon">🔒</div>
                <div className="prompt-content">
                  <h3>{t('dashboard.setMpinPrompt')}</h3>
                  <p>Set a 4-digit mPIN to secure your transactions</p>
                  <Link to="/set-mpin" className="btn-primary large">
                    {t('mpin.setMpin')}
                  </Link>
                </div>
              </div>
            )}

            {userData?.isMpinSet && !userData?.upiId && (
              <div className="prompt-card info">
                <div className="prompt-icon">💳</div>
                <div className="prompt-content">
                  <h3>Create Your UPI ID</h3>
                  <p>Generate your unique UPI ID to receive payments</p>
                  <Link to="/create-upi" className="btn-primary large">
                    Create UPI ID
                  </Link>
                </div>
              </div>
            )}

            <RemindersCard
              reminders={reminders}
              isLoading={remindersLoading}
              isSaving={reminderSaving}
              deletingId={reminderDeletingId}
              onCreateReminder={handleCreateReminder}
              onDeleteReminder={handleDeleteReminder}
            />

            <RecentTransactions
              transactions={combinedTransactions}
              isAtmLinked={userData?.isAtmLinked}
            />
          </div>

          <div className="dashboard-col sticky-col qr-col">
            {userData?.upiId && userData?.qrCodeData ? (
              <UpiDisplay upiId={userData.upiId} qrCodeData={userData.qrCodeData} />
            ) : (
              <div className="card">
                <h3>UPI not ready</h3>
                <p>Generate your Saarthi UPI ID to unlock QR payments.</p>
                <Link to="/create-upi" className="btn-primary large">
                  Create UPI ID
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;