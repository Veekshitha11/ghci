// // // // const fs = require('fs').promises;
// // // // const path = require('path');

// // // // const USERS_FILE = path.join(__dirname, '../data/users.json');
// // // // const BANK_DETAILS_FILE = path.join(__dirname, '../data/bankDetails.json');
// // // // const TRANSACTIONS_FILE = path.join(__dirname, '../data/transactions.json');

// // // // /**
// // // //  * Read JSON file helper
// // // //  */
// // // // async function readJsonFile(filePath) {
// // // //   try {
// // // //     const data = await fs.readFile(filePath, 'utf8');
// // // //     return JSON.parse(data);
// // // //   } catch (error) {
// // // //     return null;
// // // //   }
// // // // }

// // // // /**
// // // //  * Write JSON file helper
// // // //  */
// // // // async function writeJsonFile(filePath, data) {
// // // //   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// // // // }

// // // // /**
// // // //  * GET USER DETAILS - Fetch user profile and bank details
// // // //  */
// // // // exports.getUserDetails = async (req, res) => {
// // // //   try {
// // // //     const { mobile } = req.user; // From auth middleware

// // // //     // Read user data
// // // //     const usersData = await readJsonFile(USERS_FILE);
// // // //     const user = usersData.users.find(u => u.mobile === mobile);

// // // //     if (!user) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: 'User not found'
// // // //       });
// // // //     }

// // // //     // Read bank details
// // // //     const bankData = await readJsonFile(BANK_DETAILS_FILE);
// // // //     const userBankDetails = bankData.accounts.find(acc => acc.mobile === mobile);

// // // //     // Read transactions
// // // //     const transactionsData = await readJsonFile(TRANSACTIONS_FILE);
// // // //     const userTransactions = transactionsData.transactions.filter(
// // // //       t => t.mobile === mobile
// // // //     );

// // // //     res.json({
// // // //       success: true,
// // // //       user: {
// // // //         id: user.id,
// // // //         name: user.name,
// // // //         mobile: user.mobile,
// // // //         atmLinked: user.atmLinked || false,
// // // //         mpinSet: !!user.mpin
// // // //       },
// // // //       bankDetails: userBankDetails || {
// // // //         balance: 0,
// // // //         fds: [],
// // // //         loans: []
// // // //       },
// // // //       recentTransactions: userTransactions || []
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Get user details error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Failed to fetch user details'
// // // //     });
// // // //   }
// // // // };

// // // // /**
// // // //  * LINK ATM - Link ATM card to user account
// // // //  */
// // // // exports.linkAtm = async (req, res) => {
// // // //   try {
// // // //     const { mobile } = req.user;
// // // //     const { cardNumber, expiryDate, cvv } = req.body;

// // // //     // Validate input
// // // //     if (!cardNumber || !expiryDate || !cvv) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'All ATM card details are required'
// // // //       });
// // // //     }

// // // //     // Simulate ATM card validation
// // // //     if (cardNumber.length !== 16) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'Invalid card number'
// // // //       });
// // // //     }

// // // //     // Read and update user data
// // // //     const usersData = await readJsonFile(USERS_FILE);
// // // //     const userIndex = usersData.users.findIndex(u => u.mobile === mobile);

// // // //     if (userIndex === -1) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: 'User not found'
// // // //       });
// // // //     }

// // // //     usersData.users[userIndex].atmLinked = true;
// // // //     usersData.users[userIndex].atmDetails = {
// // // //       cardNumber: `****${cardNumber.slice(-4)}`, // Store masked
// // // //       expiryDate,
// // // //       linkedAt: new Date().toISOString()
// // // //     };

// // // //     await writeJsonFile(USERS_FILE, usersData);

// // // //     // Add demo transactions after ATM is linked
// // // //     const transactionsData = await readJsonFile(TRANSACTIONS_FILE);
    
// // // //     // Add some demo transactions for this user
// // // //     const demoTransactions = [
// // // //       {
// // // //         id: `txn_${Date.now()}_1`,
// // // //         mobile,
// // // //         type: 'credit',
// // // //         amount: 5000,
// // // //         description: 'Salary credited',
// // // //         date: new Date().toISOString(),
// // // //         status: 'completed'
// // // //       },
// // // //       {
// // // //         id: `txn_${Date.now()}_2`,
// // // //         mobile,
// // // //         type: 'debit',
// // // //         amount: 500,
// // // //         description: 'ATM withdrawal',
// // // //         date: new Date(Date.now() - 86400000).toISOString(),
// // // //         status: 'completed'
// // // //       }
// // // //     ];

// // // //     transactionsData.transactions.push(...demoTransactions);
// // // //     await writeJsonFile(TRANSACTIONS_FILE, transactionsData);

// // // //     res.json({
// // // //       success: true,
// // // //       message: 'ATM card linked successfully'
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Link ATM error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Failed to link ATM card'
// // // //     });
// // // //   }
// // // // };

// // // // /**
// // // //  * SET MPIN - Set 4-digit mPIN for user
// // // //  */
// // // // exports.setMpin = async (req, res) => {
// // // //   try {
// // // //     const { mobile } = req.user;
// // // //     const { mpin } = req.body;

// // // //     // Validate mPIN
// // // //     if (!mpin || !/^\d{4}$/.test(mpin)) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'mPIN must be a 4-digit number'
// // // //       });
// // // //     }

// // // //     // Read and update user data
// // // //     const usersData = await readJsonFile(USERS_FILE);
// // // //     const userIndex = usersData.users.findIndex(u => u.mobile === mobile);

// // // //     if (userIndex === -1) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: 'User not found'
// // // //       });
// // // //     }

// // // //     // In production, hash the mPIN
// // // //     usersData.users[userIndex].mpin = mpin;
// // // //     await writeJsonFile(USERS_FILE, usersData);

// // // //     res.json({
// // // //       success: true,
// // // //       message: 'mPIN set successfully'
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Set mPIN error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Failed to set mPIN'
// // // //     });
// // // //   }
// // // // };

// // // // /**
// // // //  * VERIFY MPIN - Verify mPIN for sensitive operations
// // // //  */
// // // // exports.verifyMpin = async (req, res) => {
// // // //   try {
// // // //     const { mobile } = req.user;
// // // //     const { mpin } = req.body;

// // // //     if (!mpin) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'mPIN is required'
// // // //       });
// // // //     }

// // // //     const usersData = await readJsonFile(USERS_FILE);
// // // //     const user = usersData.users.find(u => u.mobile === mobile);

// // // //     if (!user) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: 'User not found'
// // // //       });
// // // //     }

// // // //     if (!user.mpin) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'mPIN not set. Please set your mPIN first.'
// // // //       });
// // // //     }

// // // //     if (user.mpin !== mpin) {
// // // //       return res.status(401).json({
// // // //         success: false,
// // // //         verified: false,
// // // //         message: 'Incorrect mPIN'
// // // //       });
// // // //     }

// // // //     res.json({
// // // //       success: true,
// // // //       verified: true,
// // // //       message: 'mPIN verified successfully'
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Verify mPIN error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Failed to verify mPIN'
// // // //     });
// // // //   }
// // // // };

// // // // /**
// // // //  * GET PROFILE - Get user profile information
// // // //  */
// // // // exports.getProfile = async (req, res) => {
// // // //   try {
// // // //     const { mobile } = req.user;

// // // //     const usersData = await readJsonFile(USERS_FILE);
// // // //     const user = usersData.users.find(u => u.mobile === mobile);

// // // //     if (!user) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: 'User not found'
// // // //       });
// // // //     }

// // // //     res.json({
// // // //       success: true,
// // // //       profile: {
// // // //         id: user.id,
// // // //         name: user.name,
// // // //         mobile: user.mobile,
// // // //         voiceEnrolled: user.voiceEnrolled,
// // // //         atmLinked: user.atmLinked || false,
// // // //         mpinSet: !!user.mpin,
// // // //         createdAt: user.createdAt
// // // //       }
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Get profile error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Failed to fetch profile'
// // // //     });
// // // //   }
// // // // };



// // // const fs = require('fs').promises;
// // // const path = require('path');

// // // const USERS_FILE = path.join(__dirname, '../data/users.json');

// // // /**
// // //  * Read users from JSON file
// // //  */
// // // async function readUsers() {
// // //   try {
// // //     const data = await fs.readFile(USERS_FILE, 'utf8');
// // //     return JSON.parse(data);
// // //   } catch (error) {
// // //     return [];
// // //   }
// // // }

// // // /**
// // //  * Write users to JSON file
// // //  */
// // // async function writeUsers(users) {
// // //   await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
// // // }

// // // /**
// // //  * GET DASHBOARD DETAILS - STATEFUL VERSION
// // //  * CRITICAL FIX: Returns data based on actual logged-in user and their state
// // //  */
// // // exports.getDashboardDetails = async (req, res) => {
// // //   try {
// // //     const { userId } = req.user; // From auth middleware

// // //     console.log('Fetching dashboard details for user:', userId);

// // //     // Find the actual logged-in user
// // //     const users = await readUsers();
// // //     const user = users.find(u => u.user_id === userId);

// // //     if (!user) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'User not found'
// // //       });
// // //     }

// // //     // CRITICAL: Return different data based on user state
// // //     if (!user.isAtmLinked) {
// // //       // New user who hasn't linked ATM yet
// // //       console.log('User has not linked ATM yet:', userId);
      
// // //       return res.json({
// // //         success: true,
// // //         user: {
// // //           userId: user.user_id,
// // //           userName: user.userName,
// // //           mobileNumber: user.mobileNumber,
// // //           isAtmLinked: false,
// // //           isMpinSet: user.isMpinSet || false
// // //         },
// // //         bankDetails: {
// // //           balance: 0,
// // //           fds: [],
// // //           loans: []
// // //         },
// // //         recentTransactions: []
// // //       });
// // //     } else {
// // //       // User has linked ATM - show demo data
// // //       console.log('User has linked ATM, showing demo data:', userId);
      
// // //       return res.json({
// // //         success: true,
// // //         user: {
// // //           userId: user.user_id,
// // //           userName: user.userName,
// // //           mobileNumber: user.mobileNumber,
// // //           isAtmLinked: true,
// // //           isMpinSet: user.isMpinSet || false
// // //         },
// // //         bankDetails: {
// // //           balance: 50000,
// // //           fds: [
// // //             {
// // //               id: 'FD001',
// // //               name: 'Demo Fixed Deposit 1',
// // //               amount: 100000,
// // //               interestRate: 7.5,
// // //               maturityDate: '2025-12-31',
// // //               status: 'active'
// // //             },
// // //             {
// // //               id: 'FD002',
// // //               name: 'Demo Fixed Deposit 2',
// // //               amount: 50000,
// // //               interestRate: 7.0,
// // //               maturityDate: '2025-06-30',
// // //               status: 'active'
// // //             }
// // //           ],
// // //           loans: [
// // //             {
// // //               id: 'LOAN001',
// // //               name: 'Demo Personal Loan',
// // //               amount: 200000,
// // //               outstanding: 150000,
// // //               interestRate: 10.5,
// // //               emi: 5000,
// // //               nextDueDate: '2025-02-05',
// // //               status: 'active'
// // //             }
// // //           ]
// // //         },
// // //         recentTransactions: [
// // //           {
// // //             id: 'txn_001',
// // //             type: 'credit',
// // //             amount: 10000,
// // //             description: 'Salary credited',
// // //             date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
// // //             status: 'completed'
// // //           },
// // //           {
// // //             id: 'txn_002',
// // //             type: 'debit',
// // //             amount: 500,
// // //             description: 'ATM withdrawal',
// // //             date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
// // //             status: 'completed'
// // //           },
// // //           {
// // //             id: 'txn_003',
// // //             type: 'debit',
// // //             amount: 1200,
// // //             description: 'Online shopping',
// // //             date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
// // //             status: 'completed'
// // //           }
// // //         ]
// // //       });
// // //     }

// // //   } catch (error) {
// // //     console.error('Get dashboard details error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to fetch dashboard details'
// // //     });
// // //   }
// // // };

// // // /**
// // //  * LINK ATM - STATEFUL VERSION
// // //  * CRITICAL FIX: Updates the actual logged-in user's state
// // //  */
// // // exports.linkAtm = async (req, res) => {
// // //   try {
// // //     const { userId } = req.user; // From JWT token
// // //     const { cardNumber, expiryDate, cvv } = req.body;

// // //     console.log('Linking ATM for user:', userId);

// // //     // Validate input
// // //     if (!cardNumber || !expiryDate || !cvv) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'All ATM card details are required'
// // //       });
// // //     }

// // //     // Simulate ATM card validation
// // //     if (cardNumber.length !== 16) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Invalid card number. Must be 16 digits.'
// // //       });
// // //     }

// // //     if (!/^\d{3}$/.test(cvv)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Invalid CVV. Must be 3 digits.'
// // //       });
// // //     }

// // //     // Read and update user data
// // //     const users = await readUsers();
// // //     const userIndex = users.findIndex(u => u.user_id === userId);

// // //     if (userIndex === -1) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'User not found'
// // //       });
// // //     }

// // //     // CRITICAL FIX: Update the user's state to isAtmLinked = true
// // //     users[userIndex].isAtmLinked = true;
// // //     users[userIndex].atmDetails = {
// // //       cardNumberMasked: `****${cardNumber.slice(-4)}`,
// // //       expiryDate,
// // //       linkedAt: new Date().toISOString()
// // //     };

// // //     await writeUsers(users);

// // //     console.log('ATM linked successfully for user:', userId);

// // //     res.json({
// // //       success: true,
// // //       message: 'ATM card linked successfully! You can now set your mPIN.',
// // //       redirectTo: '/set-mpin'
// // //     });

// // //   } catch (error) {
// // //     console.error('Link ATM error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to link ATM card'
// // //     });
// // //   }
// // // };

// // // /**
// // //  * SET MPIN - STATEFUL VERSION
// // //  */
// // // exports.setMpin = async (req, res) => {
// // //   try {
// // //     const { userId } = req.user;
// // //     const { mpin, confirmMpin } = req.body;

// // //     console.log('Setting mPIN for user:', userId);

// // //     // Validate mPIN
// // //     if (!mpin || !/^\d{4}$/.test(mpin)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'mPIN must be a 4-digit number'
// // //       });
// // //     }

// // //     if (mpin !== confirmMpin) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'mPIN and confirm mPIN do not match'
// // //       });
// // //     }

// // //     // Read and update user data
// // //     const users = await readUsers();
// // //     const userIndex = users.findIndex(u => u.user_id === userId);

// // //     if (userIndex === -1) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'User not found'
// // //       });
// // //     }

// // //     // In production, hash the mPIN with bcrypt
// // //     // For demo, storing as plain text (NOT RECOMMENDED IN PRODUCTION)
// // //     users[userIndex].mpin = mpin;
// // //     users[userIndex].isMpinSet = true;
// // //     users[userIndex].mpinSetAt = new Date().toISOString();

// // //     await writeUsers(users);

// // //     console.log('mPIN set successfully for user:', userId);

// // //     res.json({
// // //       success: true,
// // //       message: 'mPIN set successfully!',
// // //       redirectTo: '/dashboard'
// // //     });

// // //   } catch (error) {
// // //     console.error('Set mPIN error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to set mPIN'
// // //     });
// // //   }
// // // };

// // // /**
// // //  * VERIFY MPIN - For sensitive operations
// // //  */
// // // exports.verifyMpin = async (req, res) => {
// // //   try {
// // //     const { userId } = req.user;
// // //     const { mpin } = req.body;

// // //     console.log('Verifying mPIN for user:', userId);

// // //     if (!mpin) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'mPIN is required'
// // //       });
// // //     }

// // //     const users = await readUsers();
// // //     const user = users.find(u => u.user_id === userId);

// // //     if (!user) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'User not found'
// // //       });
// // //     }

// // //     if (!user.isMpinSet || !user.mpin) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'mPIN not set. Please set your mPIN first.'
// // //       });
// // //     }

// // //     // In production, compare hashed mPIN
// // //     if (user.mpin !== mpin) {
// // //       return res.status(401).json({
// // //         success: false,
// // //         verified: false,
// // //         message: 'Incorrect mPIN'
// // //       });
// // //     }

// // //     res.json({
// // //       success: true,
// // //       verified: true,
// // //       message: 'mPIN verified successfully'
// // //     });

// // //   } catch (error) {
// // //     console.error('Verify mPIN error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to verify mPIN'
// // //     });
// // //   }
// // // };

// // // /**
// // //  * GET PROFILE - Get user profile information
// // //  */
// // // exports.getProfile = async (req, res) => {
// // //   try {
// // //     const { userId } = req.user;

// // //     const users = await readUsers();
// // //     const user = users.find(u => u.user_id === userId);

// // //     if (!user) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'User not found'
// // //       });
// // //     }

// // //     res.json({
// // //       success: true,
// // //       profile: {
// // //         userId: user.user_id,
// // //         userName: user.userName,
// // //         mobileNumber: user.mobileNumber,
// // //         voiceEnrolled: user.voiceEnrolled,
// // //         isAtmLinked: user.isAtmLinked || false,
// // //         isMpinSet: user.isMpinSet || false,
// // //         createdAt: user.createdAt,
// // //         atmDetails: user.atmDetails || null
// // //       }
// // //     });

// // //   } catch (error) {
// // //     console.error('Get profile error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to fetch profile'
// // //     });
// // //   }
// // // };





































// // const fs = require('fs').promises;
// // const path = require('path');
// // const QRCode = require('qrcode');

// // const USERS_FILE = path.join(__dirname, '../data/users.json');
// // const REMINDERS_FILE = path.join(__dirname, '../data/reminders.json');

// // /**
// //  * Read JSON file helper
// //  */
// // async function readJsonFile(filePath) {
// //   try {
// //     const data = await fs.readFile(filePath, 'utf8');
// //     return JSON.parse(data);
// //   } catch (error) {
// //     // If file doesn't exist, return empty array/object
// //     return filePath.includes('reminders') ? [] : [];
// //   }
// // }

// // /**
// //  * Write JSON file helper
// //  */
// // async function writeJsonFile(filePath, data) {
// //   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// // }

// // /**
// //  * GET DASHBOARD DETAILS - COMPLETE WITH UPI & REMINDERS
// //  */
// // exports.getDashboardDetails = async (req, res) => {
// //   try {
// //     const { userId } = req.user;

// //     console.log('Fetching dashboard details for user:', userId);

// //     const users = await readJsonFile(USERS_FILE);
// //     const user = users.find(u => u.user_id === userId);

// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'User not found'
// //       });
// //     }

// //     // Fetch reminders for this user
// //     const allReminders = await readJsonFile(REMINDERS_FILE);
// //     const userReminders = allReminders.filter(r => r.userId === userId);

// //     // CONDITIONAL DATA BASED ON STATE
// //     if (!user.isAtmLinked) {
// //       return res.json({
// //         success: true,
// //         user: {
// //           userId: user.user_id,
// //           userName: user.userName,
// //           mobileNumber: user.mobileNumber,
// //           isAtmLinked: false,
// //           isMpinSet: user.isMpinSet || false,
// //           upiId: user.upiId || null,
// //           qrCodeData: user.qrCodeData || null
// //         },
// //         bankDetails: {
// //           balance: 0,
// //           fds: [],
// //           loans: []
// //         },
// //         recentTransactions: [],
// //         reminders: userReminders
// //       });
// //     } else {
// //       return res.json({
// //         success: true,
// //         user: {
// //           userId: user.user_id,
// //           userName: user.userName,
// //           mobileNumber: user.mobileNumber,
// //           isAtmLinked: true,
// //           isMpinSet: user.isMpinSet || false,
// //           upiId: user.upiId || null,
// //           qrCodeData: user.qrCodeData || null
// //         },
// //         bankDetails: {
// //           balance: 50000,
// //           fds: [
// //             {
// //               id: 'FD001',
// //               name: 'Demo Fixed Deposit 1',
// //               amount: 100000,
// //               interestRate: 7.5,
// //               maturityDate: '2025-12-31',
// //               status: 'active'
// //             },
// //             {
// //               id: 'FD002',
// //               name: 'Demo Fixed Deposit 2',
// //               amount: 50000,
// //               interestRate: 7.0,
// //               maturityDate: '2025-06-30',
// //               status: 'active'
// //             }
// //           ],
// //           loans: [
// //             {
// //               id: 'LOAN001',
// //               name: 'Demo Personal Loan',
// //               amount: 200000,
// //               outstanding: 150000,
// //               interestRate: 10.5,
// //               emi: 5000,
// //               nextDueDate: '2025-02-05',
// //               status: 'active'
// //             }
// //           ]
// //         },
// //         recentTransactions: [
// //           {
// //             id: 'txn_001',
// //             type: 'credit',
// //             amount: 10000,
// //             description: 'Salary credited',
// //             date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
// //             status: 'completed'
// //           },
// //           {
// //             id: 'txn_002',
// //             type: 'debit',
// //             amount: 500,
// //             description: 'ATM withdrawal',
// //             date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
// //             status: 'completed'
// //           },
// //           {
// //             id: 'txn_003',
// //             type: 'debit',
// //             amount: 1200,
// //             description: 'Online shopping',
// //             date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
// //             status: 'completed'
// //           }
// //         ],
// //         reminders: userReminders
// //       });
// //     }

// //   } catch (error) {
// //     console.error('Get dashboard details error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch dashboard details'
// //     });
// //   }
// // };

// // /**
// //  * LINK ATM
// //  */
// // exports.linkAtm = async (req, res) => {
// //   try {
// //     const { userId } = req.user;
// //     const { cardNumber, expiryDate, cvv } = req.body;

// //     console.log('Linking ATM for user:', userId);

// //     if (!cardNumber || !expiryDate || !cvv) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'All ATM card details are required'
// //       });
// //     }

// //     if (cardNumber.length !== 16) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid card number. Must be 16 digits.'
// //       });
// //     }

// //     if (!/^\d{3}$/.test(cvv)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid CVV. Must be 3 digits.'
// //       });
// //     }

// //     const users = await readJsonFile(USERS_FILE);
// //     const userIndex = users.findIndex(u => u.user_id === userId);

// //     if (userIndex === -1) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'User not found'
// //       });
// //     }

// //     users[userIndex].isAtmLinked = true;
// //     users[userIndex].atmDetails = {
// //       cardNumberMasked: `****${cardNumber.slice(-4)}`,
// //       expiryDate,
// //       linkedAt: new Date().toISOString()
// //     };

// //     await writeJsonFile(USERS_FILE, users);

// //     console.log('ATM linked successfully for user:', userId);

// //     res.json({
// //       success: true,
// //       message: 'ATM card linked successfully! You can now set your mPIN.',
// //       redirectTo: '/set-mpin'
// //     });

// //   } catch (error) {
// //     console.error('Link ATM error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to link ATM card'
// //     });
// //   }
// // };

// // /**
// //  * SET MPIN
// //  */
// // exports.setMpin = async (req, res) => {
// //   try {
// //     const { userId } = req.user;
// //     const { mpin, confirmMpin } = req.body;

// //     console.log('Setting mPIN for user:', userId);

// //     if (!mpin || !/^\d{4}$/.test(mpin)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'mPIN must be a 4-digit number'
// //       });
// //     }

// //     if (mpin !== confirmMpin) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'mPIN and confirm mPIN do not match'
// //       });
// //     }

// //     const users = await readJsonFile(USERS_FILE);
// //     const userIndex = users.findIndex(u => u.user_id === userId);

// //     if (userIndex === -1) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'User not found'
// //       });
// //     }

// //     users[userIndex].mpin = mpin;
// //     users[userIndex].isMpinSet = true;
// //     users[userIndex].mpinSetAt = new Date().toISOString();

// //     await writeJsonFile(USERS_FILE, users);

// //     console.log('mPIN set successfully for user:', userId);

// //     // CRITICAL: Redirect to /create-upi instead of /dashboard
// //     res.json({
// //       success: true,
// //       message: 'mPIN set successfully!',
// //       redirectTo: '/create-upi'
// //     });

// //   } catch (error) {
// //     console.error('Set mPIN error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to set mPIN'
// //     });
// //   }
// // };

// // /**
// //  * CREATE UPI ID & GENERATE QR CODE (NEW FEATURE)
// //  */
// // exports.createUpiId = async (req, res) => {
// //   try {
// //     const { userId } = req.user;
// //     const { upiId } = req.body;

// //     console.log('Creating UPI ID for user:', userId, '- UPI ID:', upiId);

// //     if (!upiId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'UPI ID is required'
// //       });
// //     }

// //     // Validate UPI ID format (alphanumeric + @saarthi)
// //     if (!upiId.endsWith('@saarthi')) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'UPI ID must end with @saarthi'
// //       });
// //     }

// //     const users = await readJsonFile(USERS_FILE);
// //     const userIndex = users.findIndex(u => u.user_id === userId);

// //     if (userIndex === -1) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'User not found'
// //       });
// //     }

// //     // Check if UPI ID already exists
// //     const existingUpi = users.find(u => u.upiId === upiId && u.user_id !== userId);
// //     if (existingUpi) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'This UPI ID is already taken. Please choose another.'
// //       });
// //     }

// //     // Generate QR Code
// //     const upiString = `upi://pay?pa=${upiId}&pn=${users[userIndex].userName}&cu=INR`;
// //     const qrCodeData = await QRCode.toDataURL(upiString);

// //     // Save to user
// //     users[userIndex].upiId = upiId;
// //     users[userIndex].qrCodeData = qrCodeData;
// //     users[userIndex].upiCreatedAt = new Date().toISOString();

// //     await writeJsonFile(USERS_FILE, users);

// //     console.log('UPI ID created successfully for user:', userId);

// //     res.json({
// //       success: true,
// //       message: 'UPI ID created successfully!',
// //       upiId,
// //       qrCodeData,
// //       redirectTo: '/dashboard'
// //     });

// //   } catch (error) {
// //     console.error('Create UPI ID error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to create UPI ID'
// //     });
// //   }
// // };

// // /**
// //  * VERIFY MPIN
// //  */
// // exports.verifyMpin = async (req, res) => {
// //   try {
// //     const { userId } = req.user;
// //     const { mpin } = req.body;

// //     console.log('Verifying mPIN for user:', userId);

// //     if (!mpin) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'mPIN is required'
// //       });
// //     }

// //     const users = await readJsonFile(USERS_FILE);
// //     const user = users.find(u => u.user_id === userId);

// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'User not found'
// //       });
// //     }

// //     if (!user.isMpinSet || !user.mpin) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'mPIN not set. Please set your mPIN first.'
// //       });
// //     }

// //     if (user.mpin !== mpin) {
// //       return res.status(401).json({
// //         success: false,
// //         verified: false,
// //         message: 'Incorrect mPIN'
// //       });
// //     }

// //     res.json({
// //       success: true,
// //       verified: true,
// //       message: 'mPIN verified successfully'
// //     });

// //   } catch (error) {
// //     console.error('Verify mPIN error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to verify mPIN'
// //     });
// //   }
// // };

// // /**
// //  * GET PROFILE
// //  */
// // exports.getProfile = async (req, res) => {
// //   try {
// //     const { userId } = req.user;

// //     const users = await readJsonFile(USERS_FILE);
// //     const user = users.find(u => u.user_id === userId);

// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'User not found'
// //       });
// //     }

// //     res.json({
// //       success: true,
// //       profile: {
// //         userId: user.user_id,
// //         userName: user.userName,
// //         mobileNumber: user.mobileNumber,
// //         voiceEnrolled: user.voiceEnrolled,
// //         isAtmLinked: user.isAtmLinked || false,
// //         isMpinSet: user.isMpinSet || false,
// //         upiId: user.upiId || null,
// //         createdAt: user.createdAt,
// //         atmDetails: user.atmDetails || null
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Get profile error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch profile'
// //     });
// //   }
// // };





























// const fs = require('fs').promises;
// const path = require('path');
// const QRCode = require('qrcode');

// const USERS_FILE = path.join(__dirname, '../data/users.json');
// const REMINDERS_FILE = path.join(__dirname, '../data/reminders.json');

// /**
//  * Read JSON file helper
//  */
// async function readJsonFile(filePath) {
//   try {
//     const data = await fs.readFile(filePath, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     // If file doesn't exist, return empty array/object
//     return filePath.includes('reminders') ? [] : [];
//   }
// }

// /**
//  * Write JSON file helper
//  */
// async function writeJsonFile(filePath, data) {
//   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }

// /**
//  * GET DASHBOARD DETAILS - COMPLETE WITH UPI & REMINDERS
//  */
// exports.getDashboardDetails = async (req, res) => {
//   try {
//     const { userId } = req.user;

//     console.log('Fetching dashboard details for user:', userId);

//     const users = await readJsonFile(USERS_FILE);
//     const user = users.find(u => u.user_id === userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Fetch reminders for this user
//     const allReminders = await readJsonFile(REMINDERS_FILE);
//     const userReminders = allReminders.filter(r => r.userId === userId);

//     // CONDITIONAL DATA BASED ON STATE
//     if (!user.isAtmLinked) {
//       return res.json({
//         success: true,
//         user: {
//           userId: user.user_id,
//           userName: user.userName,
//           mobileNumber: user.mobileNumber,
//           isAtmLinked: false,
//           isMpinSet: user.isMpinSet || false,
//           upiId: user.upiId || null,
//           qrCodeData: user.qrCodeData || null
//         },
//         bankDetails: {
//           balance: 0,
//           fds: [],
//           loans: []
//         },
//         recentTransactions: [],
//         reminders: userReminders
//       });
//     } else {
//       return res.json({
//         success: true,
//         user: {
//           userId: user.user_id,
//           userName: user.userName,
//           mobileNumber: user.mobileNumber,
//           isAtmLinked: true,
//           isMpinSet: user.isMpinSet || false,
//           upiId: user.upiId || null,
//           qrCodeData: user.qrCodeData || null
//         },
//         bankDetails: {
//           balance: 50000,
//           fds: [
//             {
//               id: 'FD001',
//               name: 'Demo Fixed Deposit 1',
//               amount: 100000,
//               interestRate: 7.5,
//               maturityDate: '2025-12-31',
//               status: 'active'
//             },
//             {
//               id: 'FD002',
//               name: 'Demo Fixed Deposit 2',
//               amount: 50000,
//               interestRate: 7.0,
//               maturityDate: '2025-06-30',
//               status: 'active'
//             }
//           ],
//           loans: [
//             {
//               id: 'LOAN001',
//               name: 'Demo Personal Loan',
//               amount: 200000,
//               outstanding: 150000,
//               interestRate: 10.5,
//               emi: 5000,
//               nextDueDate: '2025-02-05',
//               status: 'active'
//             }
//           ]
//         },
//         recentTransactions: [
//           {
//             id: 'txn_001',
//             type: 'credit',
//             amount: 10000,
//             description: 'Salary credited',
//             date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
//             status: 'completed'
//           },
//           {
//             id: 'txn_002',
//             type: 'debit',
//             amount: 500,
//             description: 'ATM withdrawal',
//             date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//             status: 'completed'
//           },
//           {
//             id: 'txn_003',
//             type: 'debit',
//             amount: 1200,
//             description: 'Online shopping',
//             date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//             status: 'completed'
//           }
//         ],
//         reminders: userReminders
//       });
//     }

//   } catch (error) {
//     console.error('Get dashboard details error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch dashboard details'
//     });
//   }
// };

// /**
//  * LINK ATM
//  */
// exports.linkAtm = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const { cardNumber, expiryDate, cvv } = req.body;

//     console.log('Linking ATM for user:', userId);

//     if (!cardNumber || !expiryDate || !cvv) {
//       return res.status(400).json({
//         success: false,
//         message: 'All ATM card details are required'
//       });
//     }

//     if (cardNumber.length !== 16) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid card number. Must be 16 digits.'
//       });
//     }

//     if (!/^\d{3}$/.test(cvv)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid CVV. Must be 3 digits.'
//       });
//     }

//     const users = await readJsonFile(USERS_FILE);
//     const userIndex = users.findIndex(u => u.user_id === userId);

//     if (userIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     users[userIndex].isAtmLinked = true;
//     users[userIndex].atmDetails = {
//       cardNumberMasked: `****${cardNumber.slice(-4)}`,
//       expiryDate,
//       linkedAt: new Date().toISOString()
//     };

//     await writeJsonFile(USERS_FILE, users);

//     console.log('ATM linked successfully for user:', userId);

//     res.json({
//       success: true,
//       message: 'ATM card linked successfully! You can now set your mPIN.',
//       redirectTo: '/set-mpin'
//     });

//   } catch (error) {
//     console.error('Link ATM error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to link ATM card'
//     });
//   }
// };

// /**
//  * SET MPIN
//  */
// exports.setMpin = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const { mpin, confirmMpin } = req.body;

//     console.log('Setting mPIN for user:', userId);

//     if (!mpin || !/^\d{4}$/.test(mpin)) {
//       return res.status(400).json({
//         success: false,
//         message: 'mPIN must be a 4-digit number'
//       });
//     }

//     if (mpin !== confirmMpin) {
//       return res.status(400).json({
//         success: false,
//         message: 'mPIN and confirm mPIN do not match'
//       });
//     }

//     const users = await readJsonFile(USERS_FILE);
//     const userIndex = users.findIndex(u => u.user_id === userId);

//     if (userIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     users[userIndex].mpin = mpin;
//     users[userIndex].isMpinSet = true;
//     users[userIndex].mpinSetAt = new Date().toISOString();

//     await writeJsonFile(USERS_FILE, users);

//     console.log('mPIN set successfully for user:', userId);

//     // CRITICAL: Redirect to /create-upi instead of /dashboard
//     res.json({
//       success: true,
//       message: 'mPIN set successfully!',
//       redirectTo: '/create-upi'
//     });

//   } catch (error) {
//     console.error('Set mPIN error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to set mPIN'
//     });
//   }
// };

// /**
//  * CREATE UPI ID & GENERATE QR CODE (NEW FEATURE)
//  */
// exports.createUpiId = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const { upiId } = req.body;

//     console.log('Creating UPI ID for user:', userId, '- UPI ID:', upiId);

//     if (!upiId) {
//       return res.status(400).json({
//         success: false,
//         message: 'UPI ID is required'
//       });
//     }

//     // Validate UPI ID format (alphanumeric + @saarthi)
//     if (!upiId.endsWith('@saarthi')) {
//       return res.status(400).json({
//         success: false,
//         message: 'UPI ID must end with @saarthi'
//       });
//     }

//     const users = await readJsonFile(USERS_FILE);
//     const userIndex = users.findIndex(u => u.user_id === userId);

//     if (userIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Check if UPI ID already exists
//     const existingUpi = users.find(u => u.upiId === upiId && u.user_id !== userId);
//     if (existingUpi) {
//       return res.status(400).json({
//         success: false,
//         message: 'This UPI ID is already taken. Please choose another.'
//       });
//     }

//     // Generate QR Code
//     const upiString = `upi://pay?pa=${upiId}&pn=${users[userIndex].userName}&cu=INR`;
//     const qrCodeData = await QRCode.toDataURL(upiString);

//     // Save to user
//     users[userIndex].upiId = upiId;
//     users[userIndex].qrCodeData = qrCodeData;
//     users[userIndex].upiCreatedAt = new Date().toISOString();

//     await writeJsonFile(USERS_FILE, users);

//     console.log('UPI ID created successfully for user:', userId);

//     res.json({
//       success: true,
//       message: 'UPI ID created successfully!',
//       upiId,
//       qrCodeData,
//       redirectTo: '/dashboard'
//     });

//   } catch (error) {
//     console.error('Create UPI ID error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create UPI ID'
//     });
//   }
// };

// /**
//  * VERIFY MPIN
//  */
// exports.verifyMpin = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const { mpin } = req.body;

//     console.log('Verifying mPIN for user:', userId);

//     if (!mpin) {
//       return res.status(400).json({
//         success: false,
//         message: 'mPIN is required'
//       });
//     }

//     const users = await readJsonFile(USERS_FILE);
//     const user = users.find(u => u.user_id === userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     if (!user.isMpinSet || !user.mpin) {
//       return res.status(400).json({
//         success: false,
//         message: 'mPIN not set. Please set your mPIN first.'
//       });
//     }

//     if (user.mpin !== mpin) {
//       return res.status(401).json({
//         success: false,
//         verified: false,
//         message: 'Incorrect mPIN'
//       });
//     }

//     res.json({
//       success: true,
//       verified: true,
//       message: 'mPIN verified successfully'
//     });

//   } catch (error) {
//     console.error('Verify mPIN error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to verify mPIN'
//     });
//   }
// };

// /**
//  * GET PROFILE
//  */
// exports.getProfile = async (req, res) => {
//   try {
//     const { userId } = req.user;

//     const users = await readJsonFile(USERS_FILE);
//     const user = users.find(u => u.user_id === userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.json({
//       success: true,
//       profile: {
//         userId: user.user_id,
//         userName: user.userName,
//         mobileNumber: user.mobileNumber,
//         voiceEnrolled: user.voiceEnrolled,
//         isAtmLinked: user.isAtmLinked || false,
//         isMpinSet: user.isMpinSet || false,
//         upiId: user.upiId || null,
//         createdAt: user.createdAt,
//         atmDetails: user.atmDetails || null
//       }
//     });

//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch profile'
//     });
//   }
// };



































const fs = require('fs').promises;
const path = require('path');
const QRCode = require('qrcode');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const REMINDERS_FILE = path.join(__dirname, '../data/reminders.json');

/**
 * Read JSON file helper
 */
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array/object
    return filePath.includes('reminders') ? [] : [];
  }
}

/**
 * Write JSON file helper
 */
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

function sortUserReminders(reminders) {
  return reminders.sort((a, b) => {
    const aDate = new Date(a.dueDate || a.createdAt || 0).getTime();
    const bDate = new Date(b.dueDate || b.createdAt || 0).getTime();
    return aDate - bDate;
  });
}

/**
 * GET DASHBOARD DETAILS - COMPLETE WITH UPI & REMINDERS
 */
exports.getDashboardDetails = async (req, res) => {
  try {
    const { userId } = req.user;

    console.log('Fetching dashboard details for user:', userId);

    const users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.user_id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fetch reminders for this user
    const allReminders = await readJsonFile(REMINDERS_FILE);
    const userReminders = sortUserReminders(
      allReminders.filter(r => r.userId === userId && r.status !== 'deleted')
    );

    // CONDITIONAL DATA BASED ON STATE
    if (!user.isAtmLinked) {
      return res.json({
        success: true,
        user: {
          userId: user.user_id,
          userName: user.userName,
          mobileNumber: user.mobileNumber,
          isAtmLinked: false,
          isMpinSet: user.isMpinSet || false,
          upiId: user.upiId || null,
          qrCodeData: user.qrCodeData || null
        },
        bankDetails: {
          balance: 0,
          fds: [],
          loans: []
        },
        recentTransactions: [],
        reminders: userReminders
      });
    } else {
      return res.json({
        success: true,
        user: {
          userId: user.user_id,
          userName: user.userName,
          mobileNumber: user.mobileNumber,
          isAtmLinked: true,
          isMpinSet: user.isMpinSet || false,
          upiId: user.upiId || null,
          qrCodeData: user.qrCodeData || null
        },
        bankDetails: {
          balance: 50000,
          fds: [
            {
              id: 'FD001',
              name: 'Demo Fixed Deposit 1',
              amount: 100000,
              interestRate: 7.5,
              maturityDate: '2025-12-31',
              status: 'active'
            },
            {
              id: 'FD002',
              name: 'Demo Fixed Deposit 2',
              amount: 50000,
              interestRate: 7.0,
              maturityDate: '2025-06-30',
              status: 'active'
            }
          ],
          loans: [
            {
              id: 'LOAN001',
              name: 'Demo Personal Loan',
              amount: 200000,
              outstanding: 150000,
              interestRate: 10.5,
              emi: 5000,
              nextDueDate: '2025-02-05',
              status: 'active'
            }
          ]
        },
        recentTransactions: [
          {
            id: 'txn_001',
            type: 'credit',
            amount: 10000,
            description: 'Salary credited',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
          },
          {
            id: 'txn_002',
            type: 'debit',
            amount: 500,
            description: 'ATM withdrawal',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
          },
          {
            id: 'txn_003',
            type: 'debit',
            amount: 1200,
            description: 'Online shopping',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
          }
        ],
        reminders: userReminders
      });
    }

  } catch (error) {
    console.error('Get dashboard details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard details'
    });
  }
};

/**
 * LINK ATM
 */
exports.linkAtm = async (req, res) => {
  try {
    const { userId } = req.user;
    const { cardNumber, expiryDate, cvv } = req.body;

    console.log('Linking ATM for user:', userId);

    if (!cardNumber || !expiryDate || !cvv) {
      return res.status(400).json({
        success: false,
        message: 'All ATM card details are required'
      });
    }

    if (cardNumber.length !== 16) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card number. Must be 16 digits.'
      });
    }

    if (!/^\d{3}$/.test(cvv)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid CVV. Must be 3 digits.'
      });
    }

    const users = await readJsonFile(USERS_FILE);
    const userIndex = users.findIndex(u => u.user_id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    users[userIndex].isAtmLinked = true;
    users[userIndex].atmDetails = {
      cardNumberMasked: `****${cardNumber.slice(-4)}`,
      expiryDate,
      linkedAt: new Date().toISOString()
    };

    await writeJsonFile(USERS_FILE, users);

    console.log('ATM linked successfully for user:', userId);

    res.json({
      success: true,
      message: 'ATM card linked successfully! You can now set your mPIN.',
      redirectTo: '/set-mpin'
    });

  } catch (error) {
    console.error('Link ATM error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to link ATM card'
    });
  }
};

/**
 * SET MPIN
 */
exports.setMpin = async (req, res) => {
  try {
    const { userId } = req.user;
    const { mpin, confirmMpin } = req.body;

    console.log('Setting mPIN for user:', userId);

    if (!mpin || !/^\d{4}$/.test(mpin)) {
      return res.status(400).json({
        success: false,
        message: 'mPIN must be a 4-digit number'
      });
    }

    if (mpin !== confirmMpin) {
      return res.status(400).json({
        success: false,
        message: 'mPIN and confirm mPIN do not match'
      });
    }

    const users = await readJsonFile(USERS_FILE);
    const userIndex = users.findIndex(u => u.user_id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    users[userIndex].mpin = mpin;
    users[userIndex].isMpinSet = true;
    users[userIndex].mpinSetAt = new Date().toISOString();

    await writeJsonFile(USERS_FILE, users);

    console.log('mPIN set successfully for user:', userId);

    // CRITICAL: Redirect to /create-upi instead of /dashboard
    res.json({
      success: true,
      message: 'mPIN set successfully!',
      redirectTo: '/create-upi'
    });

  } catch (error) {
    console.error('Set mPIN error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set mPIN'
    });
  }
};

/**
 * CREATE UPI ID & GENERATE QR CODE (NEW FEATURE)
 */
exports.createUpiId = async (req, res) => {
  try {
    const { userId } = req.user;
    const { upiId } = req.body;

    console.log('Creating UPI ID for user:', userId, '- UPI ID:', upiId);

    if (!upiId) {
      return res.status(400).json({
        success: false,
        message: 'UPI ID is required'
      });
    }

    // Validate UPI ID format (alphanumeric + @saarthi)
    if (!upiId.endsWith('@saarthi')) {
      return res.status(400).json({
        success: false,
        message: 'UPI ID must end with @saarthi'
      });
    }

    const users = await readJsonFile(USERS_FILE);
    const userIndex = users.findIndex(u => u.user_id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if UPI ID already exists
    const existingUpi = users.find(u => u.upiId === upiId && u.user_id !== userId);
    if (existingUpi) {
      return res.status(400).json({
        success: false,
        message: 'This UPI ID is already taken. Please choose another.'
      });
    }

    // Generate QR Code
    const upiString = `upi://pay?pa=${upiId}&pn=${users[userIndex].userName}&cu=INR`;
    const qrCodeData = await QRCode.toDataURL(upiString);

    // Save to user
    users[userIndex].upiId = upiId;
    users[userIndex].qrCodeData = qrCodeData;
    users[userIndex].upiCreatedAt = new Date().toISOString();

    await writeJsonFile(USERS_FILE, users);

    console.log('UPI ID created successfully for user:', userId);

    res.json({
      success: true,
      message: 'UPI ID created successfully!',
      upiId,
      qrCodeData,
      redirectTo: '/dashboard'
    });

  } catch (error) {
    console.error('Create UPI ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create UPI ID'
    });
  }
};

/**
 * VERIFY MPIN
 */
exports.verifyMpin = async (req, res) => {
  try {
    const { userId } = req.user;
    const { mpin } = req.body;

    console.log('Verifying mPIN for user:', userId);

    if (!mpin) {
      return res.status(400).json({
        success: false,
        message: 'mPIN is required'
      });
    }

    const users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.user_id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isMpinSet || !user.mpin) {
      return res.status(400).json({
        success: false,
        message: 'mPIN not set. Please set your mPIN first.'
      });
    }

    if (user.mpin !== mpin) {
      return res.status(401).json({
        success: false,
        verified: false,
        message: 'Incorrect mPIN'
      });
    }

    res.json({
      success: true,
      verified: true,
      message: 'mPIN verified successfully'
    });

  } catch (error) {
    console.error('Verify mPIN error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify mPIN'
    });
  }
};

/**
 * GET TRANSACTIONS - With filter (week/month)
 * NEW ENDPOINT for transaction history page
 */
exports.getTransactions = async (req, res) => {
  try {
    const { userId } = req.user;
    const { filter } = req.query; // 'week' or 'month'

    console.log('Fetching transactions for user:', userId, 'Filter:', filter);

    const users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.user_id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isAtmLinked) {
      return res.json({
        success: true,
        transactions: []
      });
    }

    // Generate demo transactions based on filter
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = 7 * dayMs;
    const monthMs = 30 * dayMs;

    let transactions = [];

    if (filter === 'week') {
      // Last week transactions (7 days)
      transactions = [
        {
          id: 'txn_w1',
          type: 'credit',
          amount: 5000,
          description: 'Salary credited',
          date: new Date(now - 1 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_w2',
          type: 'debit',
          amount: 250,
          description: 'Grocery shopping',
          date: new Date(now - 2 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_w3',
          type: 'debit',
          amount: 500,
          description: 'ATM withdrawal',
          date: new Date(now - 3 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_w4',
          type: 'credit',
          amount: 1500,
          description: 'Refund received',
          date: new Date(now - 4 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_w5',
          type: 'debit',
          amount: 1200,
          description: 'Online shopping',
          date: new Date(now - 5 * dayMs).toISOString(),
          status: 'completed'
        }
      ];
    } else {
      // Last month transactions (30 days)
      transactions = [
        {
          id: 'txn_m1',
          type: 'credit',
          amount: 15000,
          description: 'Salary credited',
          date: new Date(now - 1 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_m2',
          type: 'debit',
          amount: 2500,
          description: 'Rent payment',
          date: new Date(now - 2 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_m3',
          type: 'debit',
          amount: 800,
          description: 'Electricity bill',
          date: new Date(now - 5 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_m4',
          type: 'debit',
          amount: 1200,
          description: 'Mobile recharge',
          date: new Date(now - 7 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_m5',
          type: 'credit',
          amount: 3000,
          description: 'Freelance payment',
          date: new Date(now - 10 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_m6',
          type: 'debit',
          amount: 5000,
          description: 'Shopping mall',
          date: new Date(now - 12 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_m7',
          type: 'debit',
          amount: 450,
          description: 'Restaurant',
          date: new Date(now - 15 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_m8',
          type: 'credit',
          amount: 2000,
          description: 'Cashback credited',
          date: new Date(now - 18 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_m9',
          type: 'debit',
          amount: 3500,
          description: 'Insurance premium',
          date: new Date(now - 20 * dayMs).toISOString(),
          status: 'completed'
        },
        {
          id: 'txn_m10',
          type: 'debit',
          amount: 600,
          description: 'Fuel',
          date: new Date(now - 25 * dayMs).toISOString(),
          status: 'completed'
        }
      ];
    }

    res.json({
      success: true,
      filter,
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.user_id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      profile: {
        userId: user.user_id,
        userName: user.userName,
        mobileNumber: user.mobileNumber,
        voiceEnrolled: user.voiceEnrolled,
        isAtmLinked: user.isAtmLinked || false,
        isMpinSet: user.isMpinSet || false,
        upiId: user.upiId || null,
        createdAt: user.createdAt,
        atmDetails: user.atmDetails || null
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

/**
 * Reminder APIs
 */
exports.getReminders = async (req, res) => {
  try {
    const { userId } = req.user;
    const reminders = await readJsonFile(REMINDERS_FILE);
    const userReminders = sortUserReminders(
      reminders.filter((reminder) => reminder.userId === userId && reminder.status !== 'deleted')
    );

    res.json({
      success: true,
      reminders: userReminders
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch reminders'
    });
  }
};

exports.createReminder = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      payee,
      amount,
      dueDate,
      note,
      source = 'dashboard',
      rawTranscript = ''
    } = req.body;

    if (!payee || typeof payee !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Payee name is required'
      });
    }

    const parsedAmount =
      amount === undefined || amount === null || amount === ''
        ? null
        : Number(amount);

    if (parsedAmount !== null && (Number.isNaN(parsedAmount) || parsedAmount < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    let dueDateIso = null;
    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (!Number.isNaN(parsedDate.getTime())) {
        dueDateIso = parsedDate.toISOString();
      }
    }

    const reminders = await readJsonFile(REMINDERS_FILE);
    const newReminder = {
      id: `reminder_${Date.now()}`,
      userId,
      payee: payee.trim(),
      amount: parsedAmount,
      dueDate: dueDateIso,
      dueDateLabel: formatDueDateLabel(dueDateIso),
      note: note?.trim() || '',
      source,
      rawTranscript,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    reminders.unshift(newReminder);
    await writeJsonFile(REMINDERS_FILE, reminders);

    res.status(201).json({
      success: true,
      reminder: newReminder
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to save reminder'
    });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const reminders = await readJsonFile(REMINDERS_FILE);
    const reminderIndex = reminders.findIndex(
      (reminder) => reminder.id === id && reminder.userId === userId
    );

    if (reminderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    reminders.splice(reminderIndex, 1);
    await writeJsonFile(REMINDERS_FILE, reminders);

    res.json({
      success: true,
      message: 'Reminder deleted'
    });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to delete reminder'
    });
  }
};