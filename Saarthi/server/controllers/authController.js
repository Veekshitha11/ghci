// const fs = require('fs').promises;
// const path = require('path');
// const jwt = require('jsonwebtoken');
// const MLApiClient = require('../utils/mlApiClient');

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// const USERS_FILE = path.join(__dirname, '../data/users.json');

// /**
//  * Read users from JSON file
//  */
// async function readUsers() {
//   try {
//     const data = await fs.readFile(USERS_FILE, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     return { users: [] };
//   }
// }

// /**
//  * Write users to JSON file
//  */
// async function writeUsers(data) {
//   await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
// }

// /**
//  * SIGNUP - Register new user with voice enrollment
//  * Steps:
//  * 1. Receive mobile, OTP (simulated), and voice_data (base64 audio)
//  * 2. Call ML API to enroll voice (creates voiceprint)
//  * 3. Store user in database
//  * 4. Return success (do NOT return token - user must login)
//  */
// exports.signup = async (req, res) => {
//   try {
//     const { mobile, otp, voice_data } = req.body;

//     // Validate input
//     if (!mobile || !otp || !voice_data) {
//       return res.status(400).json({
//         success: false,
//         message: 'Mobile number, OTP, and voice data are required'
//       });
//     }

//     // Simulate OTP verification (in production, verify actual OTP)
//     if (otp !== '123456') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid OTP'
//       });
//     }

//     // Read existing users
//     const usersData = await readUsers();
    
//     // Check if user already exists
//     const existingUser = usersData.users.find(u => u.mobile === mobile);
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists. Please login.'
//       });
//     }

//     // Convert base64 voice data to buffer for ML API
//     // In real implementation, voice_data would be an array of 3-5 samples
//     const audioBuffer = Buffer.from(voice_data, 'base64');
//     const audioSamples = [audioBuffer, audioBuffer, audioBuffer]; // Simulate 3 samples

//     // INTEGRATION POINT: Call ML API to enroll voice
//     try {
//       const enrollmentResult = await MLApiClient.enrollVoice(mobile, audioSamples);
      
//       if (enrollmentResult.status !== 'success') {
//         return res.status(500).json({
//           success: false,
//           message: 'Voice enrollment failed. Please try again.'
//         });
//       }
//     } catch (mlError) {
//       // If ML API is not running, continue with mock enrollment for demo
//       console.warn('ML API not available, using mock enrollment');
//     }

//     // Create new user
//     const newUser = {
//       id: Date.now().toString(),
//       mobile,
//       name: `User ${mobile.slice(-4)}`,
//       voiceEnrolled: true,
//       createdAt: new Date().toISOString(),
//       mpin: null,
//       atmLinked: false
//     };

//     usersData.users.push(newUser);
//     await writeUsers(usersData);

//     // CRITICAL: Do NOT log the user in automatically
//     // They must go to /login page
//     res.status(201).json({
//       success: true,
//       message: 'Signup successful. Please login to continue.',
//       redirectTo: '/login'
//     });

//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Signup failed. Please try again.'
//     });
//   }
// };

// /**
//  * LOGIN - Authenticate user with voice verification
//  * Steps:
//  * 1. Receive mobile, OTP (simulated), and voice_data
//  * 2. Verify OTP
//  * 3. Call ML API to verify voice against enrolled voiceprint
//  * 4. If match, generate JWT token and return it
//  */
// exports.login = async (req, res) => {
//   try {
//     const { mobile, otp, voice_data } = req.body;

//     // Validate input
//     if (!mobile || !otp || !voice_data) {
//       return res.status(400).json({
//         success: false,
//         message: 'Mobile number, OTP, and voice data are required'
//       });
//     }

//     // Simulate OTP verification
//     if (otp !== '123456') {
//       return res.status(400).json({
//         success: false,
//         match: false,
//         message: 'Invalid OTP'
//       });
//     }

//     // Check if user exists
//     const usersData = await readUsers();
//     const user = usersData.users.find(u => u.mobile === mobile);
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found. Please signup first.'
//       });
//     }

//     if (!user.voiceEnrolled) {
//       return res.status(400).json({
//         success: false,
//         message: 'Voice not enrolled. Please complete signup.'
//       });
//     }

//     // Convert base64 voice data to buffer
//     const audioBuffer = Buffer.from(voice_data, 'base64');

//     // INTEGRATION POINT: Call ML API to verify voice
//     let authenticated = false;
//     try {
//       const verificationResult = await MLApiClient.verifyVoice(mobile, audioBuffer);
//       authenticated = verificationResult.authenticated === true;
      
//       if (!authenticated) {
//         return res.status(401).json({
//           success: true,
//           match: false,
//           message: "Voice verification failed. It's not matching, please say again."
//         });
//       }
//     } catch (mlError) {
//       // If ML API is not running, use mock verification for demo
//       console.warn('ML API not available, using mock verification');
//       authenticated = true; // Allow login for demo purposes
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user.id, mobile: user.mobile },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       success: true,
//       match: true,
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         mobile: user.mobile,
//         name: user.name
//       }
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Login failed. Please try again.'
//     });
//   }
// };

// /**
//  * CHECK VOICE - Quick voice biometric check for voice assistant
//  * This is called when user clicks the mic icon
//  * Returns whether the voice is from a known or unknown user
//  */
// exports.checkVoice = async (req, res) => {
//   try {
//     const { voice_data, userId } = req.body;

//     if (!voice_data) {
//       return res.status(400).json({
//         success: false,
//         message: 'Voice data is required'
//       });
//     }

//     // Convert base64 voice data to buffer
//     const audioBuffer = Buffer.from(voice_data, 'base64');

//     // INTEGRATION POINT: Call ML API to verify voice
//     let isKnown = false;
//     try {
//       if (userId) {
//         const verificationResult = await MLApiClient.verifyVoice(userId, audioBuffer);
//         isKnown = verificationResult.authenticated === true;
//       }
//     } catch (mlError) {
//       console.warn('ML API not available for voice check');
//       // For demo, assume known if userId is provided
//       isKnown = !!userId;
//     }

//     res.json({
//       success: true,
//       user: isKnown ? 'known' : 'unknown',
//       message: isKnown 
//         ? 'Voice recognized. You can proceed.' 
//         : 'Unknown user detected. Please say again.'
//     });

//   } catch (error) {
//     console.error('Check voice error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Voice check failed. Please try again.'
//     });
//   }
// };



const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const MLApiClient = require('../utils/mlApiClient');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const USERS_FILE = path.join(__dirname, '../data/users.json');
const DEMO_OTP = process.env.DEMO_OTP || '123456';

/**
 * Read users from JSON file
 */
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty array
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
    return [];
  }
}

/**
 * Write users to JSON file
 */
async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

/**
 * Generate unique user ID
 */
function generateUserId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * SIGNUP - Register new user with voice enrollment
 * FIXED: Creates proper user object and adds to users.json
 */
exports.signup = async (req, res) => {
  try {
    const { mobileNumber, otp, userName } = req.body;
    const audioFile = req.file; // Multer file

    console.log('Signup attempt for:', mobileNumber);

    // Validate input
    if (!mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and OTP are required'
      });
    }

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: 'Voice recording is required for enrollment'
      });
    }

    // Validate OTP (simulated)
    if (otp !== DEMO_OTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Use 123456 for demo.'
      });
    }

    // Read existing users
    const users = await readUsers();
    
    // Check if user already exists
    const existingUser = users.find(u => u.mobileNumber === mobileNumber);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists. Please login.'
      });
    }

    // Generate unique user ID
    const userId = generateUserId();

    // INTEGRATION POINT: Call ML API to enroll voice
    let enrollmentSuccess = false;
    try {
      console.log('Calling ML API for voice enrollment...');
      
      // Create form data with 3 copies of the audio (simulating 3 samples)
      const audioBuffer = audioFile.buffer;
      const audioSamples = [audioBuffer, audioBuffer, audioBuffer];
      
      const enrollmentResult = await MLApiClient.enrollVoice(userId, audioSamples);
      
      if (enrollmentResult.status === 'success') {
        enrollmentSuccess = true;
        console.log('Voice enrollment successful for user:', userId);
      } else {
        return res.status(500).json({
          success: false,
          message: 'Voice enrollment failed. Please try again.'
        });
      }
    } catch (mlError) {
      console.error('ML API error during enrollment:', mlError.message);
      // For demo purposes, continue even if ML API is not available
      console.warn('Continuing with mock enrollment (ML API not available)');
      enrollmentSuccess = true;
    }

    // Create new user with STATEFUL initial values
    const newUser = {
      mobileNumber,
      user_id: userId,
      userName: userName || `User ${mobileNumber.slice(-4)}`,
      voiceEnrolled: enrollmentSuccess,
      isAtmLinked: false,
      isMpinSet: false,
      createdAt: new Date().toISOString(),
      chatHistory: []
    };

    users.push(newUser);
    await writeUsers(users);

    console.log('User created successfully:', userId);

    // CRITICAL: Do NOT log the user in automatically
    // They must go to /login page
    res.status(201).json({
      success: true,
      message: 'Signup successful. Please login to continue.',
      redirectTo: '/login'
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Signup failed. Please try again.'
    });
  }
};

/**
 * LOGIN - Authenticate user with voice verification
 * CRITICAL FIX: Check if user exists BEFORE voice verification
 */
exports.login = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;
    const audioFile = req.file; // Multer file

    console.log('Login attempt for:', mobileNumber);

    // Validate input
    if (!mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and OTP are required'
      });
    }

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: 'Voice recording is required for verification'
      });
    }

    // Validate OTP (simulated)
    if (otp !== DEMO_OTP) {
      return res.status(400).json({
        success: false,
        match: false,
        message: 'Invalid OTP. Use 123456 for demo.'
      });
    }

    // CRITICAL FIX: Check if user exists in users.json FIRST
    const users = await readUsers();
    const user = users.find(u => u.mobileNumber === mobileNumber);
    
    if (!user) {
      console.log('User not found:', mobileNumber);
      return res.status(404).json({
        success: false,
        message: 'User not registered. Please sign up first.'
      });
    }

    if (!user.voiceEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Voice not enrolled. Please complete signup.'
      });
    }

    console.log('User found, proceeding with voice verification:', user.user_id);

    // INTEGRATION POINT: Call ML API to verify voice
    let authenticated = false;
    try {
      console.log('Calling ML API for voice verification...');
      
      const audioBuffer = audioFile.buffer;
      const verificationResult = await MLApiClient.verifyVoice(user.user_id, audioBuffer);
      
      authenticated = verificationResult.authenticated === true;
      
      if (!authenticated) {
        console.log('Voice verification failed for user:', user.user_id);
        return res.status(401).json({
          success: true,
          match: false,
          message: "Voice verification failed. It's not matching, please say again."
        });
      }
      
      console.log('Voice verification successful for user:', user.user_id);
    } catch (mlError) {
      console.error('ML API error during verification:', mlError.message);
      // For demo purposes, allow login if ML API is not available
      console.warn('Allowing login (ML API not available)');
      authenticated = true;
    }

    // Generate JWT token with user_id and mobileNumber
    const token = jwt.sign(
      { 
        userId: user.user_id,
        mobileNumber: user.mobileNumber 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      match: true,
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        mobileNumber: user.mobileNumber,
        userName: user.userName,
        isAtmLinked: user.isAtmLinked,
        isMpinSet: user.isMpinSet
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

/**
 * CHECK VOICE - Quick voice biometric check for voice assistant
 * This is called when user clicks the mic icon
 */
exports.checkVoice = async (req, res) => {
  try {
    const { userId } = req.body;
    const audioFile = req.file;

    console.log('Voice check for user:', userId);

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: 'Voice recording is required'
      });
    }

    if (!userId) {
      return res.json({
        success: true,
        authenticated: false,
        message: 'Unknown user detected. Please say again.'
      });
    }

    // Check if user exists
    const users = await readUsers();
    const user = users.find(u => u.user_id === userId);

    if (!user) {
      return res.json({
        success: true,
        authenticated: false,
        message: 'Unknown user detected. Please say again.'
      });
    }

    // INTEGRATION POINT: Call ML API to verify voice
    let authenticated = false;
    try {
      const audioBuffer = audioFile.buffer;
      const verificationResult = await MLApiClient.verifyVoice(userId, audioBuffer);
      authenticated = verificationResult.authenticated === true;
    } catch (mlError) {
      console.error('ML API error during voice check:', mlError.message);
      // For demo, assume authenticated if user exists
      authenticated = true;
    }

    res.json({
      success: true,
      authenticated,
      message: authenticated 
        ? 'Voice recognized. You can proceed.' 
        : 'Unknown user detected. Please say again.'
    });

  } catch (error) {
    console.error('Check voice error:', error);
    res.status(500).json({
      success: false,
      message: 'Voice check failed. Please try again.'
    });
  }
};