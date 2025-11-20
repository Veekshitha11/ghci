// // const fs = require('fs').promises;
// // const path = require('path');
// // const MLApiClient = require('../utils/mlApiClient');

// // const USERS_FILE = path.join(__dirname, '../data/users.json');
// // const BANK_DETAILS_FILE = path.join(__dirname, '../data/bankDetails.json');
// // const TRANSACTIONS_FILE = path.join(__dirname, '../data/transactions.json');

// // /**
// //  * Read JSON file helper
// //  */
// // async function readJsonFile(filePath) {
// //   try {
// //     const data = await fs.readFile(filePath, 'utf8');
// //     return JSON.parse(data);
// //   } catch (error) {
// //     return null;
// //   }
// // }

// // /**
// //  * Write JSON file helper
// //  */
// // async function writeJsonFile(filePath, data) {
// //   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// // }

// // /**
// //  * VOICE ASSISTANT - Main Q&A endpoint
// //  * This handles all voice assistant queries and routes them based on intent
// //  * 
// //  * INTEGRATION POINT: Calls ML API /predict endpoint to get intent and entities
// //  */
// // exports.ask = async (req, res) => {
// //   try {
// //     const { queryText, language, mobile } = req.body;

// //     if (!queryText) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Query text is required'
// //       });
// //     }

// //     // INTEGRATION POINT: Call ML API to predict intent
// //     let intent = 'unknown';
// //     let entities = [];
    
// //     try {
// //       const mlResponse = await MLApiClient.predictIntent(queryText);
// //       intent = mlResponse.intent;
// //       entities = mlResponse.entities || [];
// //     } catch (mlError) {
// //       console.warn('ML API not available, using rule-based fallback');
// //       // Simple rule-based fallback for demo
// //       intent = detectIntentFallback(queryText);
// //     }

// //     // Route based on intent
// //     let response;
// //     switch (intent) {
// //       case 'balance_inquiry':
// //         response = await handleBalanceInquiry(mobile, language);
// //         break;
      
// //       case 'transaction_history':
// //         response = await handleTransactionHistory(mobile, language);
// //         break;
      
// //       case 'fund_transfer':
// //         response = await handleFundTransfer(entities, language);
// //         break;
      
// //       case 'bill_payment':
// //         response = await handleBillPayment(entities, language);
// //         break;
      
// //       case 'loan_inquiry':
// //         response = await handleLoanInquiry(mobile, language);
// //         break;
      
// //       case 'fd_withdrawal':
// //         response = await handleFdWithdrawal(mobile, language);
// //         break;
      
// //       case 'complaint_registration':
// //         response = await handleComplaint(language);
// //         break;
      
// //       case 'credit_limit_inquiry':
// //         response = await handleCreditLimitInquiry(mobile, language);
// //         break;
      
// //       // Navigation queries
// //       case 'navigation':
// //         response = handleNavigation(queryText, language);
// //         break;
      
// //       default:
// //         response = handleUnknownIntent(queryText, language);
// //     }

// //     // Save interaction to chat history
// //     await saveToHistory(mobile, queryText, response.textResponse);

// //     res.json({
// //       success: true,
// //       intent,
// //       entities,
// //       ...response
// //     });

// //   } catch (error) {
// //     console.error('Assistant ask error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to process query'
// //     });
// //   }
// // };

// // /**
// //  * FAQ ENDPOINT - Simpler Q&A for FAQ page
// //  */
// // exports.faqAsk = async (req, res) => {
// //   try {
// //     const { queryText } = req.body;

// //     if (!queryText) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Query text is required'
// //       });
// //     }

// //     // Simple FAQ matching
// //     const faqResponses = {
// //       'how to link atm': 'Go to Settings > Link ATM Card, enter your card details and verify with OTP.',
// //       'how to set mpin': 'Go to Settings > Set mPIN, enter a 4-digit PIN and confirm it.',
// //       'how to check balance': 'You can ask the voice assistant "What is my balance?" or view it on the dashboard.',
// //       'how to transfer money': 'Click on "Send Money", enter recipient details, amount, and verify with mPIN.',
// //       'forgot mpin': 'Go to Settings > Reset mPIN, verify your identity with voice and set a new PIN.',
// //       'voice not working': 'Make sure microphone permissions are enabled. Try speaking clearly and closer to the mic.'
// //     };

// //     let answer = 'I couldn\'t find an answer to that question. Please contact customer support.';
    
// //     for (const [key, value] of Object.entries(faqResponses)) {
// //       if (queryText.toLowerCase().includes(key)) {
// //         answer = value;
// //         break;
// //       }
// //     }

// //     res.json({
// //       success: true,
// //       answer
// //     });

// //   } catch (error) {
// //     console.error('FAQ ask error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to process FAQ query'
// //     });
// //   }
// // };

// // /**
// //  * GET CHAT HISTORY - Retrieve user's voice assistant interactions
// //  */
// // exports.getHistory = async (req, res) => {
// //   try {
// //     const { mobile } = req.user;
    
// //     // Read chat history (stored in a separate file or in user data)
// //     const usersData = await readJsonFile(USERS_FILE);
// //     const user = usersData.users.find(u => u.mobile === mobile);
    
// //     const history = user?.chatHistory || [];

// //     res.json({
// //       success: true,
// //       history
// //     });

// //   } catch (error) {
// //     console.error('Get history error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch chat history'
// //     });
// //   }
// // };

// // // ========== INTENT HANDLERS ==========

// // async function handleBalanceInquiry(mobile, language) {
// //   const bankData = await readJsonFile(BANK_DETAILS_FILE);
// //   const account = bankData.accounts.find(acc => acc.mobile === mobile);
  
// //   const balance = account?.balance || 0;
  
// //   const textResponse = language === 'hi' 
// //     ? `आपका खाता शेष ₹${balance} है।`
// //     : `Your account balance is ₹${balance}.`;
  
// //   return {
// //     type: 'data',
// //     textResponse,
// //     audioResponse: 'balance_audio_url', // Placeholder for TTS audio
// //     data: { balance }
// //   };
// // }

// // async function handleTransactionHistory(mobile, language) {
// //   const textResponse = language === 'hi'
// //     ? 'आपका लेन-देन इतिहास खोल रहा हूँ।'
// //     : 'Opening your transaction history.';
  
// //   return {
// //     type: 'navigation',
// //     target: '/history',
// //     textResponse,
// //     audioResponse: 'history_audio_url'
// //   };
// // }

// // async function handleFundTransfer(entities, language) {
// //   // Extract person and amount from entities
// //   const person = entities.find(e => e.label === 'B-PERSON')?.text;
// //   const amount = entities.find(e => e.label === 'B-AMOUNT')?.text;
  
// //   if (!person || !amount) {
// //     const textResponse = language === 'hi'
// //       ? 'कृपया प्राप्तकर्ता का नाम और राशि बताएं।'
// //       : 'Please provide recipient name and amount.';
    
// //     return {
// //       type: 'clarification',
// //       textResponse,
// //       audioResponse: 'clarify_audio_url'
// //     };
// //   }
  
// //   const textResponse = language === 'hi'
// //     ? `${person} को ₹${amount} भेजने के लिए अपना mPIN दर्ज करें।`
// //     : `Enter your mPIN to send ₹${amount} to ${person}.`;
  
// //   return {
// //     type: 'action',
// //     action: 'transfer',
// //     requiresMpin: true,
// //     textResponse,
// //     audioResponse: 'transfer_audio_url',
// //     data: { recipient: person, amount }
// //   };
// // }

// // async function handleBillPayment(entities, language) {
// //   const billType = entities.find(e => e.label.includes('BILL_TYPE'))?.text;
// //   const amount = entities.find(e => e.label === 'B-AMOUNT')?.text;
  
// //   const textResponse = language === 'hi'
// //     ? `बिल भुगतान के लिए तैयार करना: ${billType || 'बिल'} ${amount ? `₹${amount}` : ''}`
// //     : `Preparing bill payment for: ${billType || 'bill'} ${amount ? `₹${amount}` : ''}`;
  
// //   return {
// //     type: 'action',
// //     action: 'bill_payment',
// //     requiresMpin: true,
// //     textResponse,
// //     audioResponse: 'bill_audio_url',
// //     data: { billType, amount }
// //   };
// // }

// // async function handleLoanInquiry(mobile, language) {
// //   const bankData = await readJsonFile(BANK_DETAILS_FILE);
// //   const account = bankData.accounts.find(acc => acc.mobile === mobile);
  
// //   const loans = account?.loans || [];
  
// //   let textResponse;
// //   if (loans.length === 0) {
// //     textResponse = language === 'hi'
// //       ? 'आपके पास कोई सक्रिय ऋण नहीं है।'
// //       : 'You have no active loans.';
// //   } else {
// //     const loanInfo = loans.map(l => `${l.type}: ₹${l.amount}`).join(', ');
// //     textResponse = language === 'hi'
// //       ? `आपके ऋण: ${loanInfo}`
// //       : `Your loans: ${loanInfo}`;
// //   }
  
// //   return {
// //     type: 'data',
// //     textResponse,
// //     audioResponse: 'loan_audio_url',
// //     data: { loans }
// //   };
// // }

// // async function handleFdWithdrawal(mobile, language) {
// //   const textResponse = language === 'hi'
// //     ? 'FD निकासी के लिए अपना mPIN दर्ज करें।'
// //     : 'Enter your mPIN for FD withdrawal.';
  
// //   return {
// //     type: 'action',
// //     action: 'fd_withdrawal',
// //     requiresMpin: true,
// //     textResponse,
// //     audioResponse: 'fd_audio_url'
// //   };
// // }

// // async function handleComplaint(language) {
// //   const textResponse = language === 'hi'
// //     ? 'कृपया अपनी शिकायत बताएं, मैं इसे दर्ज कर लूंगा।'
// //     : 'Please describe your complaint, I will register it.';
  
// //   return {
// //     type: 'clarification',
// //     textResponse,
// //     audioResponse: 'complaint_audio_url'
// //   };
// // }

// // async function handleCreditLimitInquiry(mobile, language) {
// //   const textResponse = language === 'hi'
// //     ? 'आपकी क्रेडिट सीमा की जांच कर रहा हूँ।'
// //     : 'Checking your credit limit.';
  
// //   return {
// //     type: 'data',
// //     textResponse,
// //     audioResponse: 'credit_audio_url',
// //     data: { creditLimit: 50000 }
// //   };
// // }

// // function handleNavigation(query, language) {
// //   const lowerQuery = query.toLowerCase();
  
// //   let target = '/dashboard';
// //   let textResponse = 'Opening...';
  
// //   if (lowerQuery.includes('history') || lowerQuery.includes('इतिहास')) {
// //     target = '/history';
// //     textResponse = language === 'hi' ? 'इतिहास खोल रहा हूँ' : 'Opening history';
// //   } else if (lowerQuery.includes('profile') || lowerQuery.includes('प्रोफ़ाइल')) {
// //     target = '/profile';
// //     textResponse = language === 'hi' ? 'प्रोफ़ाइल खोल रहा हूँ' : 'Opening profile';
// //   } else if (lowerQuery.includes('faq') || lowerQuery.includes('help')) {
// //     target = '/faq';
// //     textResponse = language === 'hi' ? 'FAQ खोल रहा हूँ' : 'Opening FAQ';
// //   }
  
// //   return {
// //     type: 'navigation',
// //     target,
// //     textResponse,
// //     audioResponse: 'nav_audio_url'
// //   };
// // }

// // function handleUnknownIntent(query, language) {
// //   const textResponse = language === 'hi'
// //     ? 'मैं समझ नहीं पाया। कृपया फिर से कहें।'
// //     : 'I didn\'t understand that. Please say again.';
  
// //   return {
// //     type: 'unknown',
// //     textResponse,
// //     audioResponse: 'unknown_audio_url'
// //   };
// // }

// // // Simple rule-based intent detection fallback
// // function detectIntentFallback(query) {
// //   const lowerQuery = query.toLowerCase();
  
// //   if (lowerQuery.includes('balance') || lowerQuery.includes('शेष')) return 'balance_inquiry';
// //   if (lowerQuery.includes('history') || lowerQuery.includes('इतिहास')) return 'navigation';
// //   if (lowerQuery.includes('transfer') || lowerQuery.includes('send') || lowerQuery.includes('भेज')) return 'fund_transfer';
// //   if (lowerQuery.includes('bill') || lowerQuery.includes('बिल')) return 'bill_payment';
// //   if (lowerQuery.includes('loan') || lowerQuery.includes('ऋण')) return 'loan_inquiry';
// //   if (lowerQuery.includes('fd') || lowerQuery.includes('fixed')) return 'fd_withdrawal';
// //   if (lowerQuery.includes('complaint') || lowerQuery.includes('शिकायत')) return 'complaint_registration';
// //   if (lowerQuery.includes('credit') || lowerQuery.includes('limit')) return 'credit_limit_inquiry';
  
// //   return 'unknown';
// // }

// // // Save chat interaction to history
// // async function saveToHistory(mobile, query, response) {
// //   try {
// //     const usersData = await readJsonFile(USERS_FILE);
// //     const userIndex = usersData.users.findIndex(u => u.mobile === mobile);
    
// //     if (userIndex !== -1) {
// //       if (!usersData.users[userIndex].chatHistory) {
// //         usersData.users[userIndex].chatHistory = [];
// //       }
      
// //       usersData.users[userIndex].chatHistory.push({
// //         timestamp: new Date().toISOString(),
// //         query,
// //         response
// //       });
      
// //       // Keep only last 50 interactions
// //       if (usersData.users[userIndex].chatHistory.length > 50) {
// //         usersData.users[userIndex].chatHistory = 
// //           usersData.users[userIndex].chatHistory.slice(-50);
// //       }
      
// //       await writeJsonFile(USERS_FILE, usersData);
// //     }
// //   } catch (error) {
// //     console.error('Save to history error:', error);
// //   }
// // }










// const fs = require('fs').promises;
// const path = require('path');
// const MLApiClient = require('../utils/mlApiClient');

// const USERS_FILE = path.join(__dirname, '../data/users.json');
// const REMINDERS_FILE = path.join(__dirname, '../data/reminders.json');

// async function readJsonFile(filePath) {
//   try {
//     const data = await fs.readFile(filePath, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     return filePath.includes('reminders') ? [] : [];
//   }
// }

// async function writeJsonFile(filePath, data) {
//   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }

// /**
//  * VOICE ASSISTANT - Main Q&A endpoint
//  * COMPLETE with ALL 8 intents + set_reminder
//  */
// exports.ask = async (req, res) => {
//   try {
//     const { queryText, language, userId } = req.body;

//     if (!queryText) {
//       return res.status(400).json({
//         success: false,
//         message: 'Query text is required'
//       });
//     }

//     console.log('Processing query:', queryText, 'for user:', userId);

//     // INTEGRATION POINT: Call ML API to predict intent
//     let intent = 'unknown';
//     let entities = [];
    
//     try {
//       const mlResponse = await MLApiClient.predictIntent(queryText);
//       intent = mlResponse.intent;
//       entities = mlResponse.entities || [];
//       console.log('ML API response - Intent:', intent, 'Entities:', entities);
//     } catch (mlError) {
//       console.warn('ML API not available, using rule-based fallback');
//       intent = detectIntentFallback(queryText);
//     }

//     // Route based on intent - ALL 8 INTENTS COVERED
//     let response;
//     switch (intent) {
//       case 'balance_inquiry':
//         response = await handleBalanceInquiry(userId, language);
//         break;
      
//       case 'transaction_history':
//         response = await handleTransactionHistory(language);
//         break;
      
//       case 'fund_transfer':
//         response = await handleFundTransfer(entities, language);
//         break;
      
//       case 'bill_payment':
//         response = await handleBillPayment(entities, language);
//         break;
      
//       case 'loan_inquiry':
//         response = await handleLoanInquiry(userId, language);
//         break;
      
//       case 'fd_withdrawal':
//         response = await handleFdWithdrawal(language);
//         break;
      
//       case 'complaint_registration':
//         response = await handleComplaint(language);
//         break;
      
//       case 'credit_limit_inquiry':
//         response = await handleCreditLimitInquiry(language);
//         break;
      
//       case 'set_reminder':
//         response = await handleSetReminder(userId, entities, language);
//         break;
      
//       case 'navigation':
//         response = handleNavigation(queryText, language);
//         break;
      
//       default:
//         response = handleUnknownIntent(queryText, language);
//     }

//     // Save interaction to chat history
//     await saveToHistory(userId, queryText, response.textResponse);

//     res.json({
//       success: true,
//       intent,
//       entities,
//       ...response
//     });

//   } catch (error) {
//     console.error('Assistant ask error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to process query'
//     });
//   }
// };

// /**
//  * FAQ ENDPOINT
//  */
// exports.faqAsk = async (req, res) => {
//   try {
//     const { queryText } = req.body;

//     if (!queryText) {
//       return res.status(400).json({
//         success: false,
//         message: 'Query text is required'
//       });
//     }

//     const faqResponses = {
//       'how to link atm': 'Go to Settings > Link ATM Card, enter your card details and verify with OTP.',
//       'how to set mpin': 'Go to Settings > Set mPIN, enter a 4-digit PIN and confirm it.',
//       'how to check balance': 'You can ask the voice assistant "What is my balance?" or view it on the dashboard.',
//       'how to transfer money': 'Click on "Send Money", enter recipient details, amount, and verify with mPIN.',
//       'forgot mpin': 'Go to Settings > Reset mPIN, verify your identity with voice and set a new PIN.',
//       'voice not working': 'Make sure microphone permissions are enabled. Try speaking clearly and closer to the mic.',
//       'upi id': 'Your UPI ID is displayed on the dashboard. You can use it to receive payments.',
//       'qr code': 'Share your QR code from the dashboard for easy payments.'
//     };

//     let answer = 'I couldn\'t find an answer to that question. Please contact customer support.';
    
//     for (const [key, value] of Object.entries(faqResponses)) {
//       if (queryText.toLowerCase().includes(key)) {
//         answer = value;
//         break;
//       }
//     }

//     res.json({
//       success: true,
//       answer
//     });

//   } catch (error) {
//     console.error('FAQ ask error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to process FAQ query'
//     });
//   }
// };

// /**
//  * GET CHAT HISTORY
//  */
// exports.getHistory = async (req, res) => {
//   try {
//     const { userId } = req.user;
    
//     const users = await readJsonFile(USERS_FILE);
//     const user = users.find(u => u.user_id === userId);
    
//     const history = user?.chatHistory || [];

//     res.json({
//       success: true,
//       history
//     });

//   } catch (error) {
//     console.error('Get history error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch chat history'
//     });
//   }
// };

// // ========== INTENT HANDLERS ==========

// async function handleBalanceInquiry(userId, language) {
//   const users = await readJsonFile(USERS_FILE);
//   const user = users.find(u => u.user_id === userId);
  
//   const balance = user?.isAtmLinked ? 50000 : 0;
  
//   const textResponse = language === 'hi' 
//     ? `आपका खाता शेष ₹${balance} है।`
//     : `Your account balance is ₹${balance}.`;
  
//   return {
//     type: 'data',
//     textResponse,
//     data: { balance }
//   };
// }

// async function handleTransactionHistory(language) {
//   const textResponse = language === 'hi'
//     ? 'आपका लेन-देन इतिहास खोल रहा हूँ।'
//     : 'Opening your transaction history.';
  
//   return {
//     type: 'navigation',
//     target: '/history',
//     textResponse
//   };
// }

// async function handleFundTransfer(entities, language) {
//   const person = entities.find(e => e.label === 'B-PERSON')?.text;
//   const amount = entities.find(e => e.label === 'B-AMOUNT')?.text;
  
//   if (!person || !amount) {
//     const textResponse = language === 'hi'
//       ? 'कृपया प्राप्तकर्ता का नाम और राशि बताएं।'
//       : 'Please provide recipient name and amount.';
    
//     return {
//       type: 'clarification',
//       textResponse
//     };
//   }
  
//   const textResponse = language === 'hi'
//     ? `${person} को ₹${amount} भेजने के लिए अपना mPIN दर्ज करें।`
//     : `Enter your mPIN to send ₹${amount} to ${person}.`;
  
//   return {
//     type: 'action',
//     action: 'transfer',
//     requiresMpin: true,
//     textResponse,
//     data: { recipient: person, amount }
//   };
// }

// async function handleBillPayment(entities, language) {
//   const billType = entities.find(e => e.label.includes('BILL_TYPE'))?.text;
//   const amount = entities.find(e => e.label === 'B-AMOUNT')?.text;
  
//   const textResponse = language === 'hi'
//     ? `बिल भुगतान के लिए तैयार करना: ${billType || 'बिल'} ${amount ? `₹${amount}` : ''}`
//     : `Preparing bill payment for: ${billType || 'bill'} ${amount ? `₹${amount}` : ''}`;
  
//   return {
//     type: 'action',
//     action: 'bill_payment',
//     requiresMpin: true,
//     textResponse,
//     data: { billType, amount }
//   };
// }

// async function handleLoanInquiry(userId, language) {
//   const users = await readJsonFile(USERS_FILE);
//   const user = users.find(u => u.user_id === userId);
  
//   const loans = user?.isAtmLinked ? [
//     { type: 'Personal Loan', amount: 200000, outstanding: 150000 }
//   ] : [];
  
//   let textResponse;
//   if (loans.length === 0) {
//     textResponse = language === 'hi'
//       ? 'आपके पास कोई सक्रिय ऋण नहीं है।'
//       : 'You have no active loans.';
//   } else {
//     const loanInfo = loans.map(l => `${l.type}: ₹${l.outstanding} outstanding`).join(', ');
//     textResponse = language === 'hi'
//       ? `आपके ऋण: ${loanInfo}`
//       : `Your loans: ${loanInfo}`;
//   }
  
//   return {
//     type: 'data',
//     textResponse,
//     data: { loans }
//   };
// }

// async function handleFdWithdrawal(language) {
//   const textResponse = language === 'hi'
//     ? 'FD निकासी के लिए अपना mPIN दर्ज करें।'
//     : 'Enter your mPIN for FD withdrawal.';
  
//   return {
//     type: 'action',
//     action: 'fd_withdrawal',
//     requiresMpin: true,
//     textResponse
//   };
// }

// async function handleComplaint(language) {
//   const textResponse = language === 'hi'
//     ? 'कृपया अपनी शिकायत बताएं, मैं इसे दर्ज कर लूंगा।'
//     : 'Please describe your complaint, I will register it.';
  
//   return {
//     type: 'clarification',
//     textResponse
//   };
// }

// async function handleCreditLimitInquiry(language) {
//   const textResponse = language === 'hi'
//     ? 'आपकी क्रेडिट सीमा ₹50,000 है।'
//     : 'Your credit limit is ₹50,000.';
  
//   return {
//     type: 'data',
//     textResponse,
//     data: { creditLimit: 50000 }
//   };
// }

// /**
//  * NEW: Handle Set Reminder Intent
//  */
// async function handleSetReminder(userId, entities, language) {
//   try {
//     const billType = entities.find(e => e.label.includes('BILL_TYPE'))?.text || 'payment';
//     const dateText = entities.find(e => e.label.includes('DATE'))?.text || 'soon';
    
//     // Read existing reminders
//     const reminders = await readJsonFile(REMINDERS_FILE);
    
//     // Create new reminder
//     const newReminder = {
//       id: `reminder_${Date.now()}`,
//       userId,
//       billType,
//       dateText,
//       createdAt: new Date().toISOString(),
//       status: 'active'
//     };
    
//     reminders.push(newReminder);
//     await writeJsonFile(REMINDERS_FILE, reminders);
    
//     const textResponse = language === 'hi'
//       ? `ठीक है, मैं आपको ${billType} का भुगतान ${dateText} करने की याद दिला दूंगा।`
//       : `Okay, I will remind you to pay ${billType} ${dateText}.`;
    
//     return {
//       type: 'success',
//       textResponse,
//       data: { reminder: newReminder }
//     };
//   } catch (error) {
//     console.error('Error setting reminder:', error);
//     const textResponse = language === 'hi'
//       ? 'रिमाइंडर सेट करने में त्रुटि हुई।'
//       : 'Error setting reminder.';
    
//     return {
//       type: 'error',
//       textResponse
//     };
//   }
// }

// function handleNavigation(query, language) {
//   const lowerQuery = query.toLowerCase();
  
//   let target = '/dashboard';
//   let textResponse = 'Opening...';
  
//   if (lowerQuery.includes('history') || lowerQuery.includes('इतिहास')) {
//     target = '/history';
//     textResponse = language === 'hi' ? 'इतिहास खोल रहा हूँ' : 'Opening history';
//   } else if (lowerQuery.includes('profile') || lowerQuery.includes('प्रोफ़ाइल')) {
//     target = '/profile';
//     textResponse = language === 'hi' ? 'प्रोफ़ाइल खोल रहा हूँ' : 'Opening profile';
//   } else if (lowerQuery.includes('faq') || lowerQuery.includes('help')) {
//     target = '/faq';
//     textResponse = language === 'hi' ? 'FAQ खोल रहा हूँ' : 'Opening FAQ';
//   }
  
//   return {
//     type: 'navigation',
//     target,
//     textResponse
//   };
// }

// function handleUnknownIntent(query, language) {
//   const textResponse = language === 'hi'
//     ? 'मैं समझ नहीं पाया। कृपया फिर से कहें।'
//     : 'I didn\'t understand that. Please say again.';
  
//   return {
//     type: 'unknown',
//     textResponse
//   };
// }

// function detectIntentFallback(query) {
//   const lowerQuery = query.toLowerCase();
  
//   if (lowerQuery.includes('balance') || lowerQuery.includes('शेष')) return 'balance_inquiry';
//   if (lowerQuery.includes('history') || lowerQuery.includes('इतिहास')) return 'navigation';
//   if (lowerQuery.includes('transfer') || lowerQuery.includes('send') || lowerQuery.includes('भेज')) return 'fund_transfer';
//   if (lowerQuery.includes('bill') || lowerQuery.includes('बिल')) return 'bill_payment';
//   if (lowerQuery.includes('loan') || lowerQuery.includes('ऋण')) return 'loan_inquiry';
//   if (lowerQuery.includes('fd') || lowerQuery.includes('fixed')) return 'fd_withdrawal';
//   if (lowerQuery.includes('complaint') || lowerQuery.includes('शिकायत')) return 'complaint_registration';
//   if (lowerQuery.includes('credit') || lowerQuery.includes('limit')) return 'credit_limit_inquiry';
//   if (lowerQuery.includes('remind') || lowerQuery.includes('याद')) return 'set_reminder';
  
//   return 'unknown';
// }

// async function saveToHistory(userId, query, response) {
//   try {
//     const users = await readJsonFile(USERS_FILE);
//     const userIndex = users.findIndex(u => u.user_id === userId);
    
//     if (userIndex !== -1) {
//       if (!users[userIndex].chatHistory) {
//         users[userIndex].chatHistory = [];
//       }
      
//       users[userIndex].chatHistory.push({
//         timestamp: new Date().toISOString(),
//         query,
//         response
//       });
      
//       if (users[userIndex].chatHistory.length > 50) {
//         users[userIndex].chatHistory = users[userIndex].chatHistory.slice(-50);
//       }
      
//       await writeJsonFile(USERS_FILE, users);
//     }
//   } catch (error) {
//     console.error('Save to history error:', error);
//   }
// }
































const fs = require('fs').promises;
const path = require('path');
const MLApiClient = require('../utils/mlApiClient');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const REMINDERS_FILE = path.join(__dirname, '../data/reminders.json');

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return filePath.includes('reminders') ? [] : [];
  }
}

async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function formatDueDateLabel(dateInput) {
  if (!dateInput) return 'Soon';
  try {
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return 'Soon';
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch (error) {
    return 'Soon';
  }
}

function normaliseAmount(value) {
  if (!value) return null;
  const digits = value.toString().replace(/[^0-9.]/g, '');
  if (!digits) return null;
  const parsed = Number(digits);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * VOICE ASSISTANT - Main Q&A endpoint
 * COMPLETE with ALL 8 intents + set_reminder
 */
exports.ask = async (req, res) => {
  try {
    const { queryText, language, userId } = req.body;

    if (!queryText) {
      return res.status(400).json({
        success: false,
        message: 'Query text is required'
      });
    }

    console.log('Processing query:', queryText, 'for user:', userId);

    // INTEGRATION POINT: Call ML API to predict intent
    let intent = 'unknown';
    let entities = [];
    
    try {
      const mlResponse = await MLApiClient.predictIntent(queryText);
      intent = mlResponse.intent;
      entities = mlResponse.entities || [];
      console.log('ML API response - Intent:', intent, 'Entities:', entities);
    } catch (mlError) {
      console.warn('ML API not available, using rule-based fallback');
      intent = detectIntentFallback(queryText);
    }

    // Route based on intent - ALL 8 INTENTS COVERED
    let response;
    switch (intent) {
      case 'balance_inquiry':
        response = await handleBalanceInquiry(userId, language);
        break;
      
      case 'transaction_history':
        response = await handleTransactionHistory(language);
        break;
      
      case 'fund_transfer':
        response = await handleFundTransfer(entities, language);
        break;
      
      case 'bill_payment':
        response = await handleBillPayment(entities, language);
        break;
      
      case 'loan_inquiry':
        response = await handleLoanInquiry(userId, language);
        break;
      
      case 'fd_withdrawal':
        response = await handleFdWithdrawal(language);
        break;
      
      case 'complaint_registration':
        response = await handleComplaint(language);
        break;
      
      case 'credit_limit_inquiry':
        response = await handleCreditLimitInquiry(language);
        break;
      
      case 'set_reminder':
        response = await handleSetReminder(userId, entities, language);
        break;
      
      case 'navigation':
        response = handleNavigation(queryText, language);
        break;
      
      default:
        response = handleUnknownIntent(queryText, language);
    }

    // Save interaction to chat history
    await saveToHistory(userId, queryText, response.textResponse);

    res.json({
      success: true,
      intent,
      entities,
      ...response
    });

  } catch (error) {
    console.error('Assistant ask error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process query'
    });
  }
};

/**
 * FAQ ENDPOINT
 */
exports.faqAsk = async (req, res) => {
  try {
    const { queryText } = req.body;

    if (!queryText) {
      return res.status(400).json({
        success: false,
        message: 'Query text is required'
      });
    }

    const faqResponses = {
      'how to link atm': 'Go to Settings > Link ATM Card, enter your card details and verify with OTP.',
      'how to set mpin': 'Go to Settings > Set mPIN, enter a 4-digit PIN and confirm it.',
      'how to check balance': 'You can ask the voice assistant "What is my balance?" or view it on the dashboard.',
      'how to transfer money': 'Click on "Send Money", enter recipient details, amount, and verify with mPIN.',
      'forgot mpin': 'Go to Settings > Reset mPIN, verify your identity with voice and set a new PIN.',
      'voice not working': 'Make sure microphone permissions are enabled. Try speaking clearly and closer to the mic.',
      'upi id': 'Your UPI ID is displayed on the dashboard. You can use it to receive payments.',
      'qr code': 'Share your QR code from the dashboard for easy payments.'
    };

    let answer = 'I couldn\'t find an answer to that question. Please contact customer support.';
    
    for (const [key, value] of Object.entries(faqResponses)) {
      if (queryText.toLowerCase().includes(key)) {
        answer = value;
        break;
      }
    }

    res.json({
      success: true,
      answer
    });

  } catch (error) {
    console.error('FAQ ask error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process FAQ query'
    });
  }
};

/**
 * GET CHAT HISTORY
 */
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    
    const users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.user_id === userId);
    
    const history = user?.chatHistory || [];

    res.json({
      success: true,
      history
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history'
    });
  }
};

// ========== INTENT HANDLERS ==========

async function handleBalanceInquiry(userId, language) {
  const users = await readJsonFile(USERS_FILE);
  const user = users.find(u => u.user_id === userId);
  
  const balance = user?.isAtmLinked ? 50000 : 0;
  
  const textResponse = language === 'hi' 
    ? `आपका खाता शेष ₹${balance} है।`
    : `Your account balance is ₹${balance}.`;
  
  return {
    type: 'data',
    textResponse,
    data: { balance }
  };
}

async function handleTransactionHistory(language) {
  const textResponse = language === 'hi'
    ? 'आपका लेन-देन इतिहास खोल रहा हूँ।'
    : 'Opening your transaction history.';
  
  return {
    type: 'navigation',
    target: '/history',
    textResponse
  };
}

async function handleFundTransfer(entities, language) {
  const person = entities.find(e => e.label === 'B-PERSON')?.text;
  const amount = entities.find(e => e.label === 'B-AMOUNT')?.text;
  
  if (!person || !amount) {
    const textResponse = language === 'hi'
      ? 'कृपया प्राप्तकर्ता का नाम और राशि बताएं।'
      : 'Please provide recipient name and amount.';
    
    return {
      type: 'clarification',
      textResponse
    };
  }
  
  const textResponse = language === 'hi'
    ? `${person} को ₹${amount} भेजने के लिए अपना mPIN दर्ज करें।`
    : `Enter your mPIN to send ₹${amount} to ${person}.`;
  
  return {
    type: 'action',
    action: 'transfer',
    requiresMpin: true,
    textResponse,
    data: { recipient: person, amount }
  };
}

async function handleBillPayment(entities, language) {
  const billType = entities.find(e => e.label.includes('BILL_TYPE'))?.text;
  const amount = entities.find(e => e.label === 'B-AMOUNT')?.text;
  
  const textResponse = language === 'hi'
    ? `बिल भुगतान के लिए तैयार करना: ${billType || 'बिल'} ${amount ? `₹${amount}` : ''}`
    : `Preparing bill payment for: ${billType || 'bill'} ${amount ? `₹${amount}` : ''}`;
  
  return {
    type: 'action',
    action: 'bill_payment',
    requiresMpin: true,
    textResponse,
    data: { billType, amount }
  };
}

async function handleLoanInquiry(userId, language) {
  const users = await readJsonFile(USERS_FILE);
  const user = users.find(u => u.user_id === userId);
  
  const loans = user?.isAtmLinked ? [
    { type: 'Personal Loan', amount: 200000, outstanding: 150000 }
  ] : [];
  
  let textResponse;
  if (loans.length === 0) {
    textResponse = language === 'hi'
      ? 'आपके पास कोई सक्रिय ऋण नहीं है।'
      : 'You have no active loans.';
  } else {
    const loanInfo = loans.map(l => `${l.type}: ₹${l.outstanding} outstanding`).join(', ');
    textResponse = language === 'hi'
      ? `आपके ऋण: ${loanInfo}`
      : `Your loans: ${loanInfo}`;
  }
  
  return {
    type: 'data',
    textResponse,
    data: { loans }
  };
}

async function handleFdWithdrawal(language) {
  const textResponse = language === 'hi'
    ? 'FD निकासी के लिए अपना mPIN दर्ज करें।'
    : 'Enter your mPIN for FD withdrawal.';
  
  return {
    type: 'action',
    action: 'fd_withdrawal',
    requiresMpin: true,
    textResponse
  };
}

async function handleComplaint(language) {
  const textResponse = language === 'hi'
    ? 'कृपया अपनी शिकायत बताएं, मैं इसे दर्ज कर लूंगा।'
    : 'Please describe your complaint, I will register it.';
  
  return {
    type: 'clarification',
    textResponse
  };
}

async function handleCreditLimitInquiry(language) {
  const textResponse = language === 'hi'
    ? 'आपकी क्रेडिट सीमा ₹50,000 है।'
    : 'Your credit limit is ₹50,000.';
  
  return {
    type: 'data',
    textResponse,
    data: { creditLimit: 50000 }
  };
}

/**
 * NEW: Handle Set Reminder Intent
 */
async function handleSetReminder(userId, entities, language) {
  try {
    const billType = entities.find(e => e.label.includes('BILL_TYPE'))?.text;
    const personEntity = entities.find(e => e.label.includes('PERSON'))?.text;
    const dateText = entities.find(e => e.label.includes('DATE'))?.text || 'soon';
    const amountText = entities.find(e => e.label.includes('AMOUNT'))?.text;
    const amount = normaliseAmount(amountText);
    const payee = personEntity || billType || 'the contact you mentioned';
    
    let dueDateIso = null;
    if (dateText) {
      const parsedDate = new Date(dateText);
      if (!Number.isNaN(parsedDate.getTime())) {
        dueDateIso = parsedDate.toISOString();
      }
    }
    
    // Read existing reminders
    const reminders = await readJsonFile(REMINDERS_FILE);
    
    // Create new reminder
    const newReminder = {
      id: `reminder_${Date.now()}`,
      userId,
      payee,
      amount,
      dueDate: dueDateIso,
      dueDateLabel: dueDateIso ? formatDueDateLabel(dueDateIso) : dateText,
      note: billType || '',
      source: 'assistant',
      rawTranscript: '',
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    reminders.unshift(newReminder);
    await writeJsonFile(REMINDERS_FILE, reminders);
    
    const textResponse = language === 'hi'
      ? `ठीक है, मैं आपको ${payee} को ${amount ? `₹${amount}` : ''} ${dateText} भुगतान करने की याद दिला दूंगा।`
      : `Okay, I will remind you to pay ${payee} ${amount ? `₹${amount}` : ''} ${dateText}.`;
    
    return {
      type: 'success',
      textResponse,
      data: { reminder: newReminder }
    };
  } catch (error) {
    console.error('Error setting reminder:', error);
    const textResponse = language === 'hi'
      ? 'रिमाइंडर सेट करने में त्रुटि हुई।'
      : 'Error setting reminder.';
    
    return {
      type: 'error',
      textResponse
    };
  }
}

function handleNavigation(query, language) {
  const lowerQuery = query.toLowerCase();
  
  let target = '/dashboard';
  let textResponse = 'Opening...';
  
  if (lowerQuery.includes('history') || lowerQuery.includes('इतिहास')) {
    target = '/history';
    textResponse = language === 'hi' ? 'इतिहास खोल रहा हूँ' : 'Opening history';
  } else if (lowerQuery.includes('profile') || lowerQuery.includes('प्रोफ़ाइल')) {
    target = '/profile';
    textResponse = language === 'hi' ? 'प्रोफ़ाइल खोल रहा हूँ' : 'Opening profile';
  } else if (lowerQuery.includes('faq') || lowerQuery.includes('help')) {
    target = '/faq';
    textResponse = language === 'hi' ? 'FAQ खोल रहा हूँ' : 'Opening FAQ';
  }
  
  return {
    type: 'navigation',
    target,
    textResponse
  };
}

function handleUnknownIntent(query, language) {
  const textResponse = language === 'hi'
    ? 'मैं समझ नहीं पाया। कृपया फिर से कहें।'
    : 'I didn\'t understand that. Please say again.';
  
  return {
    type: 'unknown',
    textResponse
  };
}

function detectIntentFallback(query) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('balance') || lowerQuery.includes('शेष')) return 'balance_inquiry';
  if (lowerQuery.includes('history') || lowerQuery.includes('इतिहास')) return 'navigation';
  if (lowerQuery.includes('transfer') || lowerQuery.includes('send') || lowerQuery.includes('भेज')) return 'fund_transfer';
  if (lowerQuery.includes('bill') || lowerQuery.includes('बिल')) return 'bill_payment';
  if (lowerQuery.includes('loan') || lowerQuery.includes('ऋण')) return 'loan_inquiry';
  if (lowerQuery.includes('fd') || lowerQuery.includes('fixed')) return 'fd_withdrawal';
  if (lowerQuery.includes('complaint') || lowerQuery.includes('शिकायत')) return 'complaint_registration';
  if (lowerQuery.includes('credit') || lowerQuery.includes('limit')) return 'credit_limit_inquiry';
  if (lowerQuery.includes('remind') || lowerQuery.includes('याद')) return 'set_reminder';
  
  return 'unknown';
}

async function saveToHistory(userId, query, response) {
  try {
    const users = await readJsonFile(USERS_FILE);
    const userIndex = users.findIndex(u => u.user_id === userId);
    
    if (userIndex !== -1) {
      if (!users[userIndex].chatHistory) {
        users[userIndex].chatHistory = [];
      }
      
      users[userIndex].chatHistory.push({
        timestamp: new Date().toISOString(),
        query,
        response
      });
      
      if (users[userIndex].chatHistory.length > 50) {
        users[userIndex].chatHistory = users[userIndex].chatHistory.slice(-50);
      }
      
      await writeJsonFile(USERS_FILE, users);
    }
  } catch (error) {
    console.error('Save to history error:', error);
  }
}